var test = require('selenium-webdriver/testing');

var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    assert = require('selenium-webdriver/testing/assert'),
    flow = webdriver.promise.controlFlow();

var baseURL = 'http://mysite.com/apps/eva-web/src/index.html';
test.describe('Study Browser', function() {
    var driver;
    test.before(function() {
        driver = new webdriver.Builder()
            .forBrowser('firefox')
            .build();
        driver.get(baseURL);
    });

    test.after(function() {
        driver.quit();
    });
    test.it('Short Genetic Variants search by Species and Type', function() {
        driver.findElement(By.id("cookie-dismiss")).click();
        var species;
        var type;
        driver.findElement(By.xpath("//li//a[text()='Study Browser']")).click();
        driver.findElement(By.xpath("//span[contains(text(),'Barley')]//..//input")).click();
        driver.findElement(By.xpath("//span[contains(text(),'Human')]//..//input")).click();
        driver.findElement(By.id("study-submit-button")).click();
        var rows = driver.findElement(By.xpath("//div[@id='_pagingToolbar-targetEl']//div[contains(text(), 'Studies 1 -')]")).getText().then(function(text) {
            return text.split(" ")[3]
        });
//        value = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table[1]//td[4]/div[text()]")).getText();
//        assert(value).equalTo('Barley');
        for (i = 1; i < 10; i++) {
            species = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[4]/div[text()]")).getText();
            type = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[6]/div/tpl[text()]")).getText();
            var speciesRegex =   new RegExp('(Barley|Human)', 'g');
            var typeRegex =   new RegExp('(ES|WGS)', 'g');
            assert(species).matches(speciesRegex);
            assert(type).matches(typeRegex);
        }

    });

    test.it('Structural Variants search by Text', function() {
        var value;
        driver.findElement(By.xpath("//span[text()='Reset']")).click();
        driver.findElement(By.name("search")).clear();
        driver.findElement(By.name("search")).sendKeys("1000");
        driver.findElement(By.id("study-submit-button")).click();
        value = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table[1]//td[3]/div[text()]")).getText();
        var regex =   new RegExp('1000', 'g');
        assert(value).matches(regex);
        driver.findElement(By.xpath("//span[text()='Reset']")).click();
    });

    test.it('Structural Variants search by Species and Type', function() {
        var species;
        var type;
        driver.findElement(By.xpath("//label[@id='sv-boxLabelEl']")).click();
        sleep(3);
        driver.findElement(By.xpath("//span[contains(text(),'Chimpanzee')]//..//input")).click();
        driver.findElement(By.xpath("//span[contains(text(),'Dog')]//..//input")).click();
        driver.findElement(By.id("study-submit-button")).click();
        for (i = 1; i < 3; i++) {
            species = driver.findElement(By.xpath("//div[@id='study-browser-grid-body']//table["+i+"]//td[4]/div/div[text()]")).getText();
            type = driver.findElement(By.xpath("//div[@id='study-browser-grid']//table["+i+"]//td[6]/div[text()]")).getText();
            var speciesRegex =   new RegExp('(Chimpanzee|Dog)', 'g');
            var typeRegex =   new RegExp('(Control Set)', 'g');
            assert(species).matches(speciesRegex);
            assert(type).matches(typeRegex);
        }

    });

});


function sleep(value) {
    flow.execute(function () { return webdriver.promise.delayed(value * 1000);});
}

