//package ai.advance.jumei.session;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
//
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//
//public class AuthInterceptor  extends HandlerInterceptorAdapter {
//
//    private static Logger logger=LoggerFactory.getLogger(AuthInterceptor.class);
//    @Override
//    public boolean preHandle(HttpServletRequest request,
//                             HttpServletResponse response, Object handler) throws Exception {
//
//        logger.info("request:{}",request.getRequestURI());
//        return true;
//
//    }
//}
