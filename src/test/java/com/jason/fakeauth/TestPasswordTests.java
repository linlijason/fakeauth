package com.jason.fakeauth;

import org.junit.jupiter.api.Test;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;

public class TestPasswordTests {
    @Test
    public void ttt() {
        System.out.println(passwordHash("1234560"));
    }
    private String passwordHash(String p){
        return DigestUtils.md5DigestAsHex((p+"sfdfkjdf").getBytes(StandardCharsets.UTF_8));
    }
}
