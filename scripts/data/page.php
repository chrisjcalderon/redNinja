<?php
    
    function position($name,$css,$modules) {
        return array( "name"=>$name, 
                      "css"=>$css,
                      "modules"=>$modules);
    }


    function module($name,$template,$css,$title) {
        return array("name"=>$name, 
                     "template"=>$template,
                     "css"=>$css, 
                     "title"=>$title
        );
    }

    
    $page = array( 
            "top"        =>array(   position("top","",array(
                                                module("name","","","My Module 1"),
                                                module("name","","","My Module 2")
                                                )),
                                    position("top","",null),
                                    position("top","",null),
                                    position("top","",null)
             ),
            "header"     => array("positions"=>2),
            "showcase"   => array("positions"=>4),
            "maintop"    => array("positions"=>2),
            "breadcrumb" => array("positions"=>1),
            "footer"     => array("positions"=>3),
            "content"    => array(
                                    "maintop"      =>array("positions"=>2),
                                    "mainbottom"   =>array("positions"=>2),
                                    "sidebarA"     =>array("show"=>true,"align"=>"left"),
                                    "sidebarB"     =>array("show"=>true,"align"=>"right"),
                                    "sidebarC"     =>array("show"=>false,"align"=>"right"),
                                    "component"    =>array("show"=>true)
                            ),
            "test"        => array(
                    array("position"=>0,"css"=>"standard","modules"=>array(1,2,3)),
                    array("position"=>1,"css"=>"standard","modules"=>array(1,2,3)),
                    array("position"=>2,"css"=>"standard","modules"=>array(1,2,3))
                )
       );
    echo(json_encode($page));
?>
