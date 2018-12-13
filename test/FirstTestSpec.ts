import { browser } from 'protractor';
import { HomePage } from './pages/HomePage';

describe("First Sample Test", () => {

    var homepage = new HomePage();

    it("it should pass without any failure", async () => {

        await homepage.OpenBrowser("http://localhost:3000/#/");
        await homepage.GetHeading();
        await homepage.ClickTab();


    });

});