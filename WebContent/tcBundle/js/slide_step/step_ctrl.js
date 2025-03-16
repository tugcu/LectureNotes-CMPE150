/**
 * Generic definition for an animation in slide.
 * @constructor
 * @param {string} type      Animation type
 * @param {string} target    A valid CSS selector for
 *                           the animation target
 * @param {number} [duration=500]  
 *                           Duration for the animation
 * @param {string} [easing="swing"]
 *                           Easing/Interpolation function for
 *                           the animation
 * @param {object} [options={}]
 *                           An object to describe more details
 *                           for specific animations.
 * @param {string} options.from
 *                           Describes where the element will move
 *                           from, in moveIn animation.
 * @param {boolean} options.late_prepare
 *                           Prepare call for this animation, will only 
 *                           be executed right before the play call.
 * @param {boolean} options.no_reverse
 *                           Prepare calls will be ignored if the animation
 *                           is ready and played.
 * @param {string} options.text
 *                           Holds text in various animations.
 *                           
 */
var Animation = function(type, target, duration=500, easing="swing", options={}) {
	/**
	 * Describes what kind of animation should be played
	 * in play. Here's a table of all the values it can have:
	 * <table>
	 *   <tr>
	 *     <th>Type</th>
	 *     <th>Description</th>
	 *   </tr>
	 *   <tr>
	 *     <td>fadeIn</td>
	 *     <td>The target fades in.</td>
	 *   </tr>
	 *   <tr>
	 *     <td>fadeOut</td>
	 *     <td>The target fades out.</td>
	 *   </tr>
	 *   <tr>
	 *     <td>moveIn</td>
	 *     <td>The target moves in from a direction. Direction is supplied
	 * with an extra parameter named 'from'.</td>
	 *   </tr>
	 *   <tr>
	 *     <td>changeText</td>
	 *     <td>Changes the inner html of the target with a given one. The text
	 * should be given with an extra parameter named 'text'.</td>
	 *   </tr>
	 *   <tr>
	 *     <td>svg.fadeIn</td>
	 *     <td>Same with fadeIn but target should be an SVG element.</td>
	 *   </tr>
	 *   <tr>
	 *     <td>custom</td>
	 *     <td>Custom animation. Custom animations should override
	 * {@link Animation#playCustomAnimation}, {@link Animation#prepareCustomAnimation} 
	 * and {@link Animation#finishCustomAnimation} functions.</td>
	 *   </tr>
	 * </table>
	 * @member {string} Animation#type
	 */
	this.type = type;

	/**
	 * A valid CSS selector that defines the animation target.
	 * Selector may select more than one object.
	 * 
	 * @member {string} Animation#target
	 */
	this.target = target;

	/**
	 * Duration parameter of the animation. Use 0 for instant
	 * movement.
	 * 
	 * @member {number} Animation#duration
	 */
	this.duration = duration;

	/**
	 * Defines what easing function will be used on animation.
	 * Easing functions are from jQuery
	 * 
	 * Default is "swing".
	 * @member {string} Animation#easing
	 */
	this.easing = easing;

	for(var key in options) {
		this[key] = options[key];
	}

	/**
	 * Shows if this animation is currently ready to play
	 * or not.
	 *
	 * @member {boolean} Animation#ready
	 */
	this.ready = false;

	/**
	 * Shows if the animation is played recently.
	 *
	 * @member {boolean} Animation#played
	 */
	this.played = false;

	/**
	 * Custom animation behavior. Left empty for user implementation.
	 * Should be overridden while using "custom" type of animation.
	 * 
	 * @member {function} Animation#playCustomAnimation
	 * @param {Animation} anim   The animation object reference
	 */
	this.playCustomAnimation = function(anim) {};
	/**
	 * Used for custom animations. Left empty for user implementation.
	 * Should be overridden while using "custom" type of animation.
	 * 
	 * @member {function} Animation#prepareCustomAnimation
	 * @param {Animation} anim   The animation object reference
	 */
	this.prepareCustomAnimation = function(anim) {};

	/**
	 * Used to finish custom animation on a target. Should be overridden
	 * while using "custom" type of animation
	 * 
	 * @member {function} Animation#finishCustomAnimation
	 * @param {Animation} anim   The animation object reference
	 */
	this.finishCustomAnimation = function(anim) {};

	/**
	 * Moves the target out of sight, according to where
	 * it will come in to the screen.
	 * 
	 * @private
	 * @member {function} Animation.moveOutside
	 * @param {string} target     A valid CSS selector
	 * @param {string} direction  "up", "down", "left" or "right"
	 */
	this.moveOutside = function(target, direction) {
		switch(direction) {
			case "up":
				$(target).css("top", -$(target).position().top - $(target).height());
				break;
			case "down":
				$(target).css("top", ($(window).height() - $(target).position().top) + $(target).height());
				break;
			case "left":
				$(target).css("left", - $(target).position().left - $(target).width());
				break;
			case "right":
				$(target).css("left", ($(window).width() - $(target).position().left) + $(target).width());
				break;
		}
	};
};

/**
 * Plays the animation. There's a list of supported animations
 * in {@link Animation#type}.
 * 
 * @method Animation#play
 */
Animation.prototype.play = function() {
	this.beforePlay();
	if(this.late_prepare) {
		this.ready = true;
		this.played = false;
		this.prepare();
	}
	switch(this.type) {
		case "fadeIn":
			$(this.target).css("visibility", "visible");
			$(this.target).hide().fadeIn(this.duration, this.easing);
			break;
		case "fadeOut":
			$(this.target).fadeOut(this.duration,
				this,easing,
				function() {
					$(this).css("visibility", "hidden");
				});
			break;
		case "moveIn":
			$(this.target).animate({ "top" : 0, "left" : 0 },
				this.duration, this.easing);
			break;
		case "svg.fadeIn":
			var target_object = Snap.select(this.target);
			target_object.attr({ visibility : "visible" , opacity : 0})
				.animate({opacity : 1}, this.duration);
			break;
		case "svg.move":
			var target_object = Snap.select(this.target);
			target_object.animate({
				transform : "translate(" + this.toX + ", " + this.toY + ")"
			}, this.duration);
			break;
		case "set":
			for (var i = 0; i < this.animations.length; i++) {
				this.animations[i].play();
			}
			break;
		case "changeText":
			this.__old_text = $(this.target).html();
			$(this.target).html(this.text);
			// HOTFIX for code blocks that do not update after text change.
			$(".prettyprinted").removeClass("prettyprinted");
			prettyPrint();
			break;
		case "custom":
			this.playCustomAnimation(this);
			break;
		default:
			console.error("Unsupported animation: ");
			console.log(this);
	}
	this.played = true;
	this.afterPlay();
};

/**
 * Prepares the animation by setting up the preconditions for
 * it. e.g. making the target invisible if it's going to appear
 * later.
 * 
 * @method Animation#prepare
 */
Animation.prototype.prepare = function() {
	if(this.late_prepare && !this.ready) {
		return;
	}
	if(this.no_reverse && this.ready && this.played) {
		return;
	}
	this.finish();
	switch(this.type) {
		case "fadeIn":
			$(this.target).css("visibility", "hidden");
			break;
		case "fadeOut":
			$(this.target).css("visibility", "visible");
			break;
		case "moveIn":
			$(this.target).css("position", "relative");
			this.moveOutside(this.target, this.from);
			break;
		case "svg.fadeIn":
			var target_object = Snap.select(this.target);
			target_object.attr({ visibility : "hidden" });
			break;
		case "svg.move":
			var target_object = Snap.select(this.target);
			target_object.attr({
				transform : "translate(" + this.fromX + ", " + this.fromY + ")"
			});
			break;
		case "set":
			for (var i = 0; i < this.animations.length; i++) {
				this.animations[i].prepare();
			}
			break;
		case "changeText":
			if(typeof this.__old_text === 'undefined') {
				this.__old_text = $(this.target).html();
			} else {
				$(this.target).html(this.__old_text);
			}
			break;
		case "custom":
			this.prepareCustomAnimation(this);
			break;
		default:

	}
	this.ready = true;
};

/**
 * Finishes all animations of the animation target.
 * 
 * @method Animation#finish
 */
Animation.prototype.finish = function() {
	if(this.type.startsWith("svg")) {
		var target_object = Snap.select(this.target);
		
		var animObjs = target_object.inAnim();
		for (var i = 0; i < animObjs.length; i++) {
			animObjs[i].status(1);
			animObjs[i].stop();
		}
	} else if(this.type == "set") {
		for (var i = 0; i < this.animations.length; i++) {
			this.animations[i].finish();
		}
	} else if(this.type == "custom") {
		this.finishCustomAnimation(this);
	} else {
		$(this.target).finish();
	}
};


/**
 * Executed right before starting to play the animation.
 * 
 * @method Animation#beforePlay
 */
Animation.prototype.beforePlay = function() {};


/**
 * Executed right after starting to play the animation.
 * This is not an onComplete function. As soon as the animation
 * start is triggered, this method will be called, too.
 *
 * @method Animation#afterPlay
 */
Animation.prototype.afterPlay = function() {};

/**
 * Basic slide step framework for sd4u Eclipse bundle.
 *
 * Provides step by step animations that can be navigated 
 * programmatically, so that it can be bound to different 
 * events, e.g. key events,...<br />
 * 
 * <strong>Requirements:</strong><br />
 * <ul>
 *   <li>jQuery 2.1.1</li>
 * </ul>
 *
 * <strong>Basic Usage:</strong><br />
 * <ol>
 *   <li>Replace steps array with something useful for the slide.</li>
 *   <li>Call {@link StepCtrl.init|init()}</li>
 *   <li>Use {@link StepCtrl.nextStep|nextStep()} and {@link StepCtrl.previousStep|previousStep()} to navigate through steps.</li>
 * </ol>
 * 
 * All steps above should be executed after the page loads.
 * @namespace
 */
var StepCtrl = {

	
	/**
	 * 
	 * Steps define what to do on each step of the slide.
	 * There can be different parameters for each type of step.
	 *
	 * Here's a list of all possible step types.
	 * <table>
	 *   <tr>
	 *     <th>Type</th>
	 *     <th>Description</th>
	 *     <th>On Execution</th>
	 *     <th>On Reverse Execution</th>
	 *     <th>Parameters</th>
	 *   </tr>
	 *   <tr>
	 *     <td>prevPage</td>
	 *     <td>This must be the first step of every page.</td>
	 *     <td>This should never happen unless you want to go one slide back
	 * in the middle of the slide. </td>
	 *     <td>Calls {@link StepCtrl.previousPage|previousPage()}.</td>
	 *     <td><strong>None</strong></td>
	 *   </tr>
	 *   <tr>
	 *     <td>nextPage</td>
	 *     <td>This must be the last step of every page.</td>
	 *     <td>Calls {@link StepCtrl.nextPage|nextPage()}.</td>
	 *     <td>This should never happen unless you want to go one slide 
	 * forward in the middle of the slide while going back through steps
	 * (!).</td>
	 *     <td><strong>None</strong></td>
	 *   </tr>
	 *   <tr>
	 *     <td>anim</td>
	 *     <td>This type of step is used to play animation on the page.</td>
	 *     <td>Calls {@link Animation.play} on 
	 * given animation.</td>
	 *     <td>Calls {@link Animation.prepare} 
	 * on given animation.</td>
	 *     <td><strong>animation</strong>:An animation object.</td>
	 *   </tr>
	 * </table>
	 * @member {array} StepCtrl.steps
	 */
	steps : [
		{
			type : "prevPage"
		},
		{
			type : "nextPage"
		}
	],

	/**
	 * Shows which step the controller is currently in.
	 * Used while executing steps. Good to not modify from 
	 * outside.
	 * 
	 * @member {number} StepCtrl.currentStep
	 */
	currentStep : 0,

	/**
	 * Initializes the module.
	 * 
	 * Currently this only checks out the {@link StepCtrl.steps} array
	 * and calls {@link Animation.prepare} 
	 * for each 'anim' step. So it is necessary to modify 
	 * the {@link StepCtrl.steps} array first, if it is going 
	 * to be modified in the future.
	 */
	init : function() {
		for (var i = 0; i < this.steps.length; i++) {
			if(this.steps[i].type == "anim") {
				this.steps[i].animation.prepare();
			}
		}
	},

	/**
	 * Increments the {@link StepCtrl.currentStep} by one. And
	 * executes the step at that number.
	 * 
	 * Step execution is completely based on the 'type' field
	 * of each step. There's detailed explanation about what are
	 * the possible type variables are and what they exactly do
	 * in {@link StepCtrl.steps}.
	 */
	nextStep : function() {
		// pre execution
		var step = undefined;
		switch((step = this.steps[this.currentStep]).type) {
			case "anim":
				step.animation.finish();
			default:
		}

		// real execution
		if(++this.currentStep >= this.steps.length)
			this.currentStep = this.steps.length - 1;
		
		switch((step = this.steps[this.currentStep]).type) {
			case "prevPage":
				// This cannot happen.
				// Should be logged.
				break;
			case "nextPage":
				nextPage();
				break;
			case "anim":
				step.animation.play();
				break;
			default:
				console.error("Unsupported step operation: ");
				console.log(step);
		}

	},

	/**
	 * Reverse executes the step at {@link StepCtrl.currentStep}, then
	 * decrements the {@link StepCtrl.currentStep} by one.
	 *
	 * There are detailed explanations about what exactly is the reverse
	 * execution of each step in {@link StepCtrl.steps}.
	 */
	previousStep : function() {
		var step = undefined;
		switch((step = this.steps[this.currentStep]).type) {
			case "prevPage":
				previousPage();
				break;
			case "nextPage":
				// This should never happen.
				// Should be logged.
				break;
			case "anim":
				// Thinking that doing the preparation for the animation
				// should work for going back.
				step.animation.prepare();
				break;
			default:
				console.error("Unsupported step operation: ");
				console.log(step);
		}
		if(--this.currentStep < 0) 
			this.currentStep = 0;
	}

};
