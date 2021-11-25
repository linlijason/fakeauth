package ai.advance.jumei.session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;

public class LoginInterceptor extends HandlerInterceptorAdapter {

    @Autowired
    private UserHolder userHolder;

    private static Logger logger= LoggerFactory.getLogger(LoginInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response, Object handler) throws Exception {
       // AuthUtils.getSessionId()
        UserCache userCache=new UserCache();
        userCache.setUsername("admin");
        userCache.setAuthorities(new ArrayList<>());
        userCache.setAuthPath(new ArrayList<>());
        userHolder.setUser(userCache);
        logger.info("PHP是垃圾!!!");
        return true;

    }
}
