/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014 -2017 EMBL - European Bioinformatics Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var config = require('./config.js');
config.loadModules();
var variantBrowser = require('./variant_browser_bottom_panel_tests.js');

function runTableTest(sectionName, testName, element, elementID, expectedResults, checkFunction) {
    test.describe(sectionName, function() {
        test.it(testName, function() {
            var rowIndex = 1;
            expectedResults.forEach(function(expectedResult) {
                var colIndex = 1;
                for (var expectedResultKey in expectedResult) {
                    checkFunction(driver, element, elementID, rowIndex, colIndex, expectedResult[expectedResultKey]);
                    colIndex += 1;
                }
                rowIndex += 1;
            });
        });
    });
}

function checkSection(driver, element, elementID, rowIndex, colIndex, expectedValue) {
    var tableToFind = "//" + element + "[@id='" + elementID + "']";
    var pathToElement = tableToFind + "//tr[" + rowIndex + "]" + "//td[" + colIndex + "]";
    driver.wait(until.elementLocated(By.xpath(pathToElement)), config.wait()).then(function(text) {
        driver.findElement(By.xpath(pathToElement)).getText().then(function(text){
            assert(text).equalTo(expectedValue);
        });
    });
    return driver;
}

function checkGenotypeGrid(driver, element, elementID, rowIndex, colIndex, expectedValue) {
    var divToFind = "//" + element + "[@id='" + elementID + "']";
    var pathToElement = "(" + divToFind + "//table)[" + rowIndex + "]" + "//tr[1]//td[" + colIndex + "]//div";
    driver.wait(until.elementLocated(By.xpath(pathToElement)), config.wait()).then(function(text) {
        driver.findElement(By.xpath(pathToElement)).getText().then(function(text){
            assert(text).equalTo(expectedValue);
        });
    });
    return driver;
}

function checkPopulationStatsGrid(driver, element, elementID, rowIndex, colIndex, expectedValue) {
    var divToFind = "//" + element + "[@id='" + elementID + "']";
    var pathToElement = "(" + divToFind + "//table)[" + rowIndex + "]" + "//tr[1]//td[" + (colIndex + 1) + "]//div";
    driver.wait(until.elementLocated(By.xpath(pathToElement)), config.wait()).then(function(text) {
        driver.findElement(By.xpath(pathToElement)).getText().then(function(text){
            assert(text).equalTo(expectedValue);
        });
    });
    return driver;
}

function checkElementContent(sectionName, testName, element, elementID, expectedValue) {
    test.describe(sectionName, function() {
        test.it(testName, function() {
            var elementToFind = "//" + element + "[@id='" + elementID + "']";
            driver.wait(until.elementLocated(By.xpath(elementToFind)), config.wait()).then(function(text) {
                driver.findElement(By.xpath(elementToFind)).getText().then(function(text){
                    assert(text).equalTo(expectedValue);
                });
            });
        });
    });
}

test.describe('Variant View - rs exclusive to EVA', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs2020677&species=mmusculus_grcm38');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Mouse", "Assembly": "GCA_000001635.6", "Contig": "7",
                            "Start": "119786918", "ID": "rs2020677", "Orientation": "Fwd", "Type": "SNV",
                            "Created Date": ""}];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);

    expectedResults = [{"ID": "ss47184058", "Contig": "7", "Start": "119786918",
                        "End": "119786918", "Reference": "G", "Alternate": "A", "Created Date": ""},
                        {"ID": "ss1565899", "Contig": "7", "Start": "119786918",
                         "End": "119786918", "Reference": "G", "Alternate": "A", "Created Date": ""},
                        {"ID": "ss372922602", "Contig": "7", "Start": "119786918",
                         "End": "119786918", "Reference": "G", "Alternate": "A", "Created Date": ""}
                      ];
    runTableTest("Submitted Variant Section", "Submitted Variant Section has the correct values for attributes",
                "table", "submitted-variant-summary", expectedResults, checkSection);
});

test.describe('Variant View - ss exclusive to EVA', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=ss914406059&species=mmusculus_grcm38');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Mouse", "Assembly": "GCA_000001635.6", "Contig": "1",
                            "Start": "3001313", "End": "3001313", "Reference": "C", "Alternate": "A",
                            "ID": "ss914406059", "Orientation": "Fwd", "Type": "SNV", "Evidence?": "Yes",
                            "Alleles match reference assembly?": "", "Passed allele checks?": "",
                            "Validated?": "", "Created Date": ""},
                           {"Organism": "Mouse", "Assembly": "GCA_000001635.6", "Contig": "1",
                           "Start": "3001313", "End": "3001313", "Reference": "C", "Alternate": "T",
                           "ID": "ss914406059", "Orientation": "Fwd", "Type": "SNV", "Evidence?": "Yes",
                           "Alleles match reference assembly?": "", "Passed allele checks?": "",
                           "Validated?": "", "Created Date": ""}
                          ];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);

    checkElementContent("RS link", "RS link points to the correct ID", "a", "rs-link", "rs582038162");

    expectedResults = [{"Ensembl Gene ID": "-", "Ensembl Transcript ID": "-",
                        "Accession": "SO:0001628", "Name": "intergenic_variant MODIFIER"}];
    runTableTest("Consequence Type Section", "Consequence Type Section has the correct values",
                "table", "consequence-type-summary-1", expectedResults, checkSection);
    runTableTest("Consequence Type Section", "Consequence Type Section has the correct values",
                "table", "consequence-type-summary-2", expectedResults, checkSection);

    expectedResults = [{"Sample": "129P2", "Genotype": "0/0"}, {"Sample": "129S1", "Genotype": "0/0"},
                       {"Sample": "129S5", "Genotype": "0/0"}];
    runTableTest("Genotypes Section", "Genotypes Section for C/A has the correct values",
                "div", "genotypes_C_A", expectedResults, checkGenotypeGrid);
    runTableTest("Genotypes Section", "Genotypes Section for C/T has the correct values",
                "div", "genotypes_C_T", expectedResults, checkGenotypeGrid);

    expectedResults = [{"Population": "ALL", "Minor Allele Frequency": "0.058", "MAF Allele": "A",
                            "Missing Alleles": "0", "Missing Genotypes": "0"}
                          ];
    runTableTest("Population Statistics Section", "Population Statistics Section for C/A has the correct values",
                    "div", "popstats_C_A", expectedResults, checkPopulationStatsGrid);
    expectedResults = [{"Population": "ALL", "Minor Allele Frequency": "0.058", "MAF Allele": "T",
                        "Missing Alleles": "0", "Missing Genotypes": "0"}
                      ];
    runTableTest("Population Statistics Section", "Population Statistics Section for C/T has the correct values",
                    "div", "popstats_C_T", expectedResults, checkPopulationStatsGrid);
});

test.describe('Variant View - rs exclusive to Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs884750506&species=dcarota_ASM162521v1');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Carrot", "Assembly": "GCA_001625215.1", "Contig": "CM004278.1",
                            "Start": "672678", "ID": "rs884750506", "Orientation": "Fwd", "Type": "SNV",
                            "Created Date": "October 27, 2016"}];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);

    expectedResults = [{"ID": "ss1996903386", "Contig": "CM004278.1", "Start": "672678",
                        "End": "672678", "Reference": "A", "Alternate": "C,G,T", "Created Date": "May 19, 2016"}
                      ];
    runTableTest("Submitted Variant Section", "Submitted Variant Section has the correct values for attributes",
                "table", "submitted-variant-summary", expectedResults, checkSection);
});

test.describe('Variant View - ss exclusive to Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=ss1996903386&species=dcarota_ASM162521v1');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Carrot", "Assembly": "GCA_001625215.1", "Contig": "CM004278.1",
                            "Start": "672678", "End": "672678", "Reference": "A", "Alternate": "T",
                            "ID": "ss1996903386", "Orientation": "Fwd", "Type": "", "Evidence?": "No",
                            "Alleles match reference assembly?": "Yes", "Passed allele checks?": "Yes",
                            "Validated?": "No", "Created Date": "May 19, 2016"}];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);
});

test.describe('Variant View - rs found in both EVA and Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=rs869710784&species=csabaeus_chlsab11');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Vervet monkey", "Assembly": "GCA_000409795.2", "Contig": "11",
                            "Start": "50921862", "ID": "rs869710784", "Orientation": "Fwd", "Type": "SNV",
                            "Created Date": "May 16, 2016"}];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);

    expectedResults = [{"ID": "ss1991442915", "Contig": "11", "Start": "50921862",
                        "End": "50921862", "Reference": "C", "Alternate": "G", "Created Date": "May 5, 2016"}
                      ];
    runTableTest("Submitted Variant Section", "Submitted Variant Section has the correct values for attributes",
                "table", "submitted-variant-summary", expectedResults, checkSection);
});

test.describe('Variant View - ss found in both EVA and Accessioning', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant&accessionID=ss1991442915&species=csabaeus_chlsab11');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Vervet monkey", "Assembly": "GCA_000409795.2", "Contig": "11",
                            "Start": "50921862", "End": "50921862", "Reference": "C", "Alternate": "G",
                            "ID": "ss1991442915", "Orientation": "Fwd", "Type": "SNV", "Evidence?": "Yes",
                            "Alleles match reference assembly?": "Yes", "Passed allele checks?": "Yes",
                            "Validated?": "No", "Created Date": "May 5, 2016"}];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);

    expectedResults = [{"Ensembl Gene ID": "-", "Ensembl Transcript ID": "-",
                            "Accession": "SO:0001628", "Name": "intergenic_variant MODIFIER"}];
    runTableTest("Consequence Type Section", "Consequence Type Section has the correct values",
                "table", "consequence-type-summary-1", expectedResults, checkSection);

    expectedResults = [{"CHROM": "CHROM", "POS": "POS", "ID": "ID", "REF": "REF", "ALT": "ALT"},
                       {"CHROM": "11", "POS": "50921862", "ID": "CAE11_50921862", "REF": "C", "ALT": "G"}];
    runTableTest("Files Section", "Files Section has the correct values",
                "table", "files-panel-table-1", expectedResults, checkSection);

    expectedResults = [{"Sample": "1983091", "Genotype": "1/1"}, {"Sample": "1984011", "Genotype": "1/1"},
                       {"Sample": "1984014", "Genotype": "0/1"}, {"Sample": "1984084", "Genotype": "0/1"}
                      ];
    runTableTest("Genotypes Section", "Genotypes Section has the correct values",
                "div", "genotypes_C_G", expectedResults, checkGenotypeGrid);

    expectedResults = [{"Population": "ALL", "Minor Allele Frequency": "0.352", "MAF Allele": "C",
                        "Missing Alleles": "0", "Missing Genotypes": "0"}
                      ];
    runTableTest("Population Statistics Section", "Population Statistics Section for C/G has the correct values",
                    "div", "popstats_C_G", expectedResults, checkPopulationStatsGrid);
});

test.describe('Variant View - ss by position', function() {
    var driver;
    test.before(function() {
        driver = config.initDriver(config.browser());
        driver.get(config.baseURL()+'?variant=1:3000017:C:T&species=hsapiens_grch37');
    });

    test.after(function() {
        config.shutdownDriver(driver);
    });

    var expectedResults = [{"Organism": "Human", "Assembly": "GCA_000001405.1", "Contig": "1",
                            "Start": "3000017", "End": "3000017", "Reference": "C", "Alternate": "T", "ID":"ss1289423512",
                            "Orientation": "Fwd", "Type": "SNV", "Evidence?": "Yes",
                            "Alleles match reference assembly?": "", "Passed allele checks?": "",
                            "Validated?": "", "Created Date": ""}];
    runTableTest("Variant Information Section", "Variant Information Section has the correct values for attributes",
                "table", "variant-view-summary", expectedResults, checkSection);

    expectedResults = [{"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000270722",
                                "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000378391",
                                "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000378398",
                               "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000441472",
                              "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000442529",
                              "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000511072",
                              "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000514189",
                              "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000607632",
                              "Accession": "SO:0001627", "Name": "intron_variant MODIFIER"},
                       {"Ensembl Gene ID": "ENSG00000142611", "Ensembl Transcript ID": "ENST00000607632",
                             "Accession": "SO:0001619", "Name": "non_coding_transcript_variant MODIFIER"},
                      ];
    runTableTest("Consequence Type Section", "Consequence Type Section has the correct values",
                "table", "consequence-type-summary-1", expectedResults, checkSection);

    expectedResults = [{"CHROM": "CHROM", "POS": "POS", "ID": "ID", "REF": "REF", "ALT": "ALT"},
                       {"CHROM": "1", "POS": "3000017", "ID": "rs557866728", "REF": "C", "ALT": "T"}];
    runTableTest("Files Section", "Files Section has the correct values",
                "table", "files-panel-table-1", expectedResults, checkSection);

    expectedResults = [{"Sample": "HG00096", "Genotype": "0|0"}, {"Sample": "HG00097", "Genotype": "0|0"},
                       {"Sample": "HG00099", "Genotype": "0|0"}, {"Sample": "HG00100", "Genotype": "0|0"}
                      ];
    runTableTest("Genotypes Section", "Genotypes Section has the correct values",
                "div", "genotypes_C_T", expectedResults, checkGenotypeGrid);

    expectedResults = [{"Population": "ACB", "Minor Allele Frequency": "0", "MAF Allele": "T",
                        "Missing Alleles": "0", "Missing Genotypes": "0"},
                       {"Population": "ALL", "Minor Allele Frequency": "1.997e-4", "MAF Allele": "T",
                        "Missing Alleles": "0", "Missing Genotypes": "0"}
                      ];
    runTableTest("Population Statistics Section", "Population Statistics Section has the correct values",
                    "div", "popstats_C_T", expectedResults, checkPopulationStatsGrid);
});