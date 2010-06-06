<?php
/*php enable gzip ... safely function.
Sometimes its hard to guarantee that output has not been started and that output has not already been written to a buffer. most of the time you are asked to make a site perform better and they want it now.

copyright ryanday 2010
http://ryanday.org
mit/lgpl and all that

this function will only start gzip if it can.
this function will take the contents of all currently active output buffers and echo their contents after gzip headers have been set into the gzip buffer.

one thing to note is that file servers that manually specify the Content-length header from the file size or the string length of the files content will cause the client to hang waiting for more content that is never comming because the content has been compressed.
*/

function enableGZIP(){
        static $gziped = false;
        if($gziped) return;
        $gziped = true;
        $UA = isset($_SERVER['HTTP_USER_AGENT'])?$_SERVER['HTTP_USER_AGENT']:'';
	/*
	i was unsure if the weight of gzip compression was having a negative impact on
	perceived page load speed. Here are some vars i used to a,b - my results were inconclusive
	*/
        //$ie6 = instr($UA,'MSIE 6');
        //$ie6gzip = defined('IE6_GZIP')?IE6_GZIP:false;
   
        if(!headers_sent() && (php_sapi_name() !== 'cli') /*&& (!$ie6 || $ie6gzip)*/){
                //gather any output that has been written to a buffer
                $con = '';
                while(ob_get_level()){
                        $con .= ob_get_contents();
                        ob_end_clean();
                }
                ob_start("ob_gzhandler");
                //echo any previously buffered content
                echo $con;
        }
}