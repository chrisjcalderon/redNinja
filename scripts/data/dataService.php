<?php
  function getData(){
        mysql_connect("localhost", "", "") or die(mysql_error());
        mysql_select_db("") or die(mysql_error());
        $sql = mysql_query("select id,name,username,email,usertype from jos_users");
        $userinfo = array();

        while ( $row_user = mysql_fetch_assoc($sql) ) {
            $userinfo[] = $row_user;
        }
        return $userinfo;
  }
    echo(json_encode(getData()));

?>