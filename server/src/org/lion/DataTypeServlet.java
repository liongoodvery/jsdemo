package org.lion;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by lion on 2/6/17.
 */
@WebServlet(name = "DataTypeServlet", urlPatterns = "/type")
public class DataTypeServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String type = request.getParameter("type");
        switch (type) {
            case "html":
                request.getRequestDispatcher("/index.html").forward(request,response);
                break;
            case "json":
                request.getRequestDispatcher("/assets/json/test.json").forward(request,response);
                break;
            case "script":
                request.getRequestDispatcher("/assets/js/test.js").forward(request,response);
                break;
            case "css":
                request.getRequestDispatcher("/assets/css/main.css").forward(request,response);
                break;
            default:
                response.setStatus(404);
                response.getOutputStream().println("no support type");
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }
}
