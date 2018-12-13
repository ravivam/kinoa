import {Config} from 'protractor';

export let config : Config = {

    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ["../features/*.feature"],

    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),

    baseUrl: "http://localhost:3000/#/",

    cucumberOpts: {
        complier: "ts:ts-node/register",
        strict: true,
        //format: ['pretty'],
        require: ['../steps/*.js', '../hooks/*.js'],
        tags: '@smoke'

    }

}