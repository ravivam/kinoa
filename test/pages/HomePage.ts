import { browser, element, by, protractor, $$, $ } from 'protractor';
import { IdentificationType, BasePage } from './BasePage';

const Locators = {

    contacts: {

        type: IdentificationType[IdentificationType.Xpath],
        value: "//*[@id=sidebarTab]/li[2]/a"
    }
}

export class HomePage extends BasePage {

    //contacts tab
    contacts = this.ElementLocator(Locators.contacts);

    //open browser
    async OpenBrowser(url: string) {
        await browser.get(url);
    }

    async GetHeading() {
        await this.contacts.getText().then((text) => {
            console.log("The heading is :" + text);
        });
    }

    async ClickTab() {

        await this.contacts.click();
    }

}