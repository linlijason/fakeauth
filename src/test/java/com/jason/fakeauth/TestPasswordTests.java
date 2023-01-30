package com.jason.fakeauth;

import org.apache.commons.codec.digest.Md5Crypt;
import org.junit.jupiter.api.Test;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;

public class TestPasswordTests {
    @Test
    public void ttt()  throws Exception{
        String s ="/data-source/register_api" + "@" + "e9d34b22cdcd11e78d73842b2b738d12" + "@" + "1656424120985";
        System.out.println(s);
        s = org.apache.commons.codec.digest.DigestUtils.md5Hex(s);
        System.out.println(s);
        System.out.println(passwordHash("123456"));

    }
    private String passwordHash(String p){
        return DigestUtils.md5DigestAsHex((p+"20d135f0f28185b84a4cf7aa51f29500").getBytes(StandardCharsets.UTF_8));
    }
}
