package com.jason.fakeauth.controller;


import com.jason.fakeauth.data.User;
import com.jason.fakeauth.data.UserJpaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Controller
public class AuthController {

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private UserJpaRepository userJpaRepository;

    @Autowired
    private StringRedisTemplate redis;

    @Value("${auth.appkey}")
    private String appKey;

    @Value("${auth.loginurl}")
    private String loginurl;

    private static final Logger logger  = LoggerFactory.getLogger(AuthController.class);

    @GetMapping("/auth/login")
    public String fakeLogin(){
        ///login/?camefrom=
        return  "login";
    }

    @PostMapping("/auth/signin")
    public String signin(@RequestParam("username")String username,
                         @RequestParam("password")String password,
                         ModelMap modelMap){

        /*

            private static final String SUPERUSER = "SUPERUSER";
    private static final String MANAGER = "MANAGER";
    private static final String SPECIALIST = "SPECIALIST";

         */
        Optional<User> user = userJpaRepository.findByUsername(username);
        if(user.isPresent()){
            if(user.get().getStatus()==0){
                modelMap.put("errorMsg","用户被禁用!");
            }else {
                String pwd = passwordHash(password);
                if (pwd.equals(user.get().getPassword())) {
                    try {
                        return loginOk(user.get());
                    }catch (Exception e){

                        modelMap.put("errorMsg", "登录失败!");
                    }
                } else {
                    modelMap.put("errorMsg", "密码不正确!");
                }
            }
        }else{
            modelMap.put("errorMsg","用户不存在!");
        }
        return "login";

    }
    private String passwordHash(String p){
       return DigestUtils.md5DigestAsHex((p+appKey).getBytes(StandardCharsets.UTF_8));
    }
    private String loginOk(User user) throws Exception {
        String token = UUID.randomUUID().toString().replace("-", "");
        String s = token + appKey + user.getUsername();
        String sessionId = encode(s, "SHA1");
        Map<String, String> value = new HashMap<>();
        value.put("username",user.getUsername());
        value.put("roles",user.getRole());

        redis.opsForHash().putAll(sessionId, value);
        redis.expire(sessionId, 8, TimeUnit.HOURS);
        logger.info("successOk user={} sessionId={}",user.getUsername(),sessionId);
        return "redirect:" + loginurl + String.format("?token=%s&username=%s&login_url=no", token, user.getUsername());
    }


    //原token方法
    public static String encode(String str, String arithmetic) throws Exception {
        MessageDigest messageDigest = null;
        messageDigest = MessageDigest.getInstance(arithmetic);
        messageDigest.reset();
        messageDigest.update(str.getBytes("UTF-8"));

        byte[] byteArray = messageDigest.digest();

        StringBuffer md5StrBuff = new StringBuffer();

        for (int i = 0; i < byteArray.length; i++) {
            if (Integer.toHexString(0xFF & byteArray[i]).length() == 1)
                md5StrBuff.append("0").append(Integer.toHexString(0xFF & byteArray[i]));
            else
                md5StrBuff.append(Integer.toHexString(0xFF & byteArray[i]));
        }

        return md5StrBuff.toString();
    }


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
