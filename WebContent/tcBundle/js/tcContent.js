/*
 *	packSwe510
 */

function softdev4uContent_init() {
	sd4uContentDivRemark();
	sd4uContentDivDefinition();
	sd4uContentDivTheorem();
}


function sd4uContentDivRemark() {
	$('.sd4uDivRemark').prepend('<b>Remark</> ');
}

function sd4uContentDivDefinition() {
	$('.sd4uDivDefinition').prepend('<b>Definition</> ');
}


function sd4uContentDivTheorem() {
	$('.sd4uDivTheorem').prepend('<b>Theorem</> ');
}

