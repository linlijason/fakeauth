//package com.jason.fakeauth.test;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.ApplicationArguments;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Component;
//
//@Component
//public class TestCommandRunner implements ApplicationRunner {
//
//    @Autowired
//    private JdbcTemplate jdbc;
//
//    @Autowired
//    private RedisTemplate<String,String> redis;
//
//    @Override
//    public void run(ApplicationArguments args) throws Exception {
//
//        redis.opsForValue().set("aa","aa");
//        System.out.println("hello"+redis.opsForValue().get("aa"));
//    }
//}
