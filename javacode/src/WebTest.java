import com.google.gson.Gson;
import org.junit.Assert;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by lion on 1/21/17.
 */
public class WebTest {
    @org.junit.Test
    public void test6() throws Exception {
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("shui_hu");
        Assert.assertNotNull(inputStream);
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line;
        List<ShuiHu> shuiHus = new ArrayList<>();
        while ((line = reader.readLine()) != null) {
            String[] strings = line.split("\\s");
            Assert.assertEquals(4, strings.length);
            ShuiHu shuiHu = new ShuiHu();
            shuiHu.id = Integer.valueOf(strings[0]);
            shuiHu.star = strings[1];
            shuiHu.nickName =strings[2];
            shuiHu.name = strings[3];
            shuiHus.add(shuiHu);
        }
        Assert.assertEquals(108, shuiHus.size());
        Gson gson = new Gson();
        System.out.println(gson.toJson(shuiHus));

    }
}
