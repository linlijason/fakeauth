package com.jason.fakeauth.controller;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@Controller
public class AuthController {

    @Autowired
    private HttpServletRequest request;

    @GetMapping("/fake/login")
    public String fakeLogin(){
        //token+appkey+username  SHA1方法
        return  "login";
    }

    //原token方法
//    public static String encode(String str, String arithmetic) throws NoSuchAlgorithmException, UnsupportedEncodingException {
//        MessageDigest messageDigest = null;
//        messageDigest = MessageDigest.getInstance(arithmetic);
//        messageDigest.reset();
//        messageDigest.update(str.getBytes("UTF-8"));
//
//        byte[] byteArray = messageDigest.digest();
//
//        StringBuffer md5StrBuff = new StringBuffer();
//
//        for (int i = 0; i < byteArray.length; i++) {
//            if (Integer.toHexString(0xFF & byteArray[i]).length() == 1)
//                md5StrBuff.append("0").append(Integer.toHexString(0xFF & byteArray[i]));
//            else
//                md5StrBuff.append(Integer.toHexString(0xFF & byteArray[i]));
//        }
//
//        return md5StrBuff.toString();
//    }


//    @GetMapping("/auth/info")
//    public Map info(@RequestParam("session_id") String sessionId) {
//        System.out.println("info:" + sessionId);
//
//        //{"username": "xxx", "mail": "xx@xx.com", "fullname": "xxx"}
//
//        // return  "{\"username\": \"xxx\", \"mail\": \"xx@xx.com\", \"fullname\": \"xxx\"}";
//        Map map = new HashMap();
//        map.put("username", "admin");
//        map.put("mail", "admin@mail.com");
//        map.put("fullname", "admin");
//        return map;
//    }
//
//    @GetMapping("/auth/grouprole")
//    public void fake(HttpServletRequest request, HttpServletResponse response) {
//
//    }
}
