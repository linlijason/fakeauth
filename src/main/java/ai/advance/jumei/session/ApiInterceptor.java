package ai.advance.jumei.session;

import com.alibaba.fastjson.JSON;
import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

public class ApiInterceptor extends HandlerInterceptorAdapter {

    private static Logger logger = LoggerFactory.getLogger(ApiInterceptor.class);

    @Value("${jumei.auth.api.app.key}")
    private String APP_KEY;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response, Object handler) throws Exception {

        try {
           // logger.info("request:{}", request.getRequestURI());
            String sign = request.getParameter("sign");
            String time = request.getParameter("time");
            if (isNull(sign) || isNull(time)) {

                output403(request.getRequestURI(), response);
                return false;
            }
            String s = request.getRequestURI() + "@" + time + "@" + APP_KEY;
            String s1 = DigestUtils.md5Hex(s);
           // logger.info("request:time={} sign={} s1={} s1={} app_key={}", time, sign, s, s1, APP_KEY);
            if (s1.equalsIgnoreCase(sign)) {
                return true;
            } else {
                output403(request.getRequestURI(), response);
                return false;
            }
        } catch (Exception e) {
            logger.error("error", e);
            return false;
        }

    }

    private boolean isNull(String s) {
        return s == null || s.length() == 0;
    }

    private void output403(String uri, HttpServletResponse response) throws Exception {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        Map data = new HashMap<>();
        if (uri.startsWith("/api")) {
            data.put("code", 403);
            data.put("errorMsg", "sign error");
        } else {
            data.put("errcode", 403);
            data.put("errmsg", "sign error");
        }
        response.getWriter().write(JSON.toJSONString(data));
        response.getWriter().flush();
    }

}
