version 20171231

# Description
Handles md to pure html processing.
- eclipse creates md+tc to html+tc conversion.
- cash codes transform html+tc to pure html.
- sd4uBundle updates 

# version history
when        who what
## 20171201 hb	 
- Created

## 20171216 hb  
- markdown.css and markdown.js are added. 
- F1 is changed to include markdown.css and markdown.js.
- sd4u to tc transformation including sd4uBundle, css and js directories, and F1.

## 20171220 hb
- all non `softdev4u` stuff is transferred from `softdev4uBundle` to `tcBundle`
- they are mainly outside libraries
- exceptions 
  - `css/softdev4u.css`
  - `css/softdev4uContent.css`
  - `js/softdev4u.js`
  - `js/softdev4uContent.js`
- there should not be any need for `softdev4u` stuff any more.
- for reference purposes `softdev4u` stuff is kept under `softdev4uBundle`

## 20171231 hb
- MathJax is using https://cdnjs.cloudflare.com
- MathJax has nothing in local

## 20180101 hb
- MathJax is local now.