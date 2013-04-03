<?php
  function getData($id){
        mysql_connect("localhost", "", "") or die(mysql_error());
        mysql_select_db("morethanamom_db") or die(mysql_error());
        $sql = mysql_query("select id,title,introtext from jos_content where id=$id");
        $article = NULL;

        while ( $data = mysql_fetch_assoc($sql) ) {
            $article  = $data;
        }
        $article['introtext'] = $article['introtext']."<h1>The ID: $id  <h1>";
        return $article ;
  }
    
    echo(json_encode(getData( $_GET['id'] )));

?>