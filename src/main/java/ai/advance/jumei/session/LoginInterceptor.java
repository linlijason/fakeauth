//package ai.advance.jumei.session;
//
//import ai.advance.jumei.util.AuthUtils;
//import ai.advance.jumei.util.Constant;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.redis.core.StringRedisTemplate;
//import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
//
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.util.ArrayList;
//import java.util.List;
//
//public class LoginInterceptor extends HandlerInterceptorAdapter {
//
//    @Autowired
//    private UserHolder userHolder;
//
//    @Autowired
//    private StringRedisTemplate redisTemplate;

//import org.springframework.beans.factory.annotation.Value;
//
//@Value("${jumei.auth.api.addr}")
//private String LOGIN_API_ADDR;

//
//    private static Logger logger = LoggerFactory.getLogger(LoginInterceptor.class);
//
//    @Override
//    public boolean preHandle(HttpServletRequest request,
//                             HttpServletResponse response, Object handler) throws Exception {
//
//
//        String sid = getSessionId(request);
//        if (sid == null) {
//            return false;
//        }
//        String username = (String) redisTemplate.opsForHash().get(sid, "username");
//        if (username == null) {
    // LOGIN_API_ADDR+"/login"
//            return false;
//        }
//        String roles = (String) redisTemplate.opsForHash().get(sid, "roles");
//        if (roles == null) {
//            roles = "";
//        }
//        List<String> authorities = new ArrayList<>();
//        for (String s : roles.split(",")) {
//            authorities.add(s);
//        }
//        UserCache userCache = new UserCache();
//        userCache.setUsername(username);
//        userCache.setAuthorities(authorities);
//        userCache.setAuthPath(new ArrayList<>());
//        userHolder.setUser(userCache);
//        // logger.info("PHP是垃圾!!!");
//        return true;
//
//    }
//
//    private String getSessionId(HttpServletRequest request) {
//        try {
//            return (String) request.getSession().getAttribute(Constant.getJUMEI_SESSION_KEY());
//        } catch (Exception e) {
//            return null;
//        }
//
//    }
//}