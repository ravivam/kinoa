import {defineSupportCode} from 'cucumber'
import { HomePage } from '../pages/HomePage';

defineSupportCode(({Given, When, Then}) => {
    var homepage = new HomePage();

    Given('I navigate to application', async () =>{

        await homepage.OpenBrowser("http://localhost:3000/#/");


    });

    When ('I  click on Contacts tab', async ()=>{

        await homepage.ClickTab();

    });


});
