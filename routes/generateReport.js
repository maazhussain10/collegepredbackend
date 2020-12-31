const express = require("express");
const sqlFunctions = require('../files/sqlFunctions');


class GenerateReport {

    constructor(app) {
        this.generateReport(app);
    }

    generateReport(app) {
        app.post('/generateReport', async (req, res) => {
            const {
                selectedOption,
                selectedDepartments,
                mergeCharts
            } = req.query;

            let query = "select * from " + selectedOption + " where ";

            if (mergeCharts === "true") {
                for (let i = 0; i < selectedDepartments.length; i++) {
                    query += " department =" + "'" + selectedDepartments[i] + "'";
                    if (i != selectedDepartments.length - 1) {
                        query += " or ";
                    } else {
                        query += ";";
                    }
                }
            }

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

            let result;
            if (mergeCharts === "true") {
                result = await sqlFunctions.generateReport(query);
            } else {
                result = await sqlFunctions.generateUniqueReport(selectedOption, selectedDepartments);
            }

            if (mergeCharts === "true") {

                const finalReport = [{
                    year: "2024",
                    department: "Departments",
                    keys: [],
                    values: []
                }]
                const tempValues = [];
                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < Object.keys(result[i]).length; j++) {
                        let key = Object.keys(result[i])[j];
                        let value = Object.values(result[i])[j];
                        if (!(key == "year" || key == "department" || key == "total_count" || key == "total")) {
                            if (finalReport[0].keys.includes(key) == false) {
                                finalReport[0].keys.push(key);
                            }
                            tempValues.push(parseInt(value / 3));
                        }
                    }
                }
                for (let i = 0; i < finalReport[0].keys.length; i++) {
                    let value = 0;
                    let index = i;
                    for (let j = 0; j < tempValues.length / finalReport[0].keys.length; j++) {
                        value += tempValues[index];
                        index = index + finalReport[0].keys.length;
                    }
                    finalReport[0].values.push(value);
                }
                res.send(finalReport);
            }




            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (mergeCharts === "false") {
                const finalReport = [];
                const departmentValues = [];
                for (let i = 0; i < selectedDepartments.length; i++) {
                    let tempo = {
                        year: "2024",
                        department: selectedDepartments[i],
                        keys: [],
                        values: []
                    }
                    finalReport.push(tempo);
                }
                console.log(result);
                for (let k = 0; k < finalReport.length; k++) {
                    let tempValues = [];
                    for (let i = 0; i < result[k].length; i++) {
                        for (let j = 0; j < Object.keys(result[k][i]).length; j++) {
                            let key = Object.keys(result[k][i])[j];
                            let value = Object.values(result[k][i])[j];
                            if (!(key == "year" || key == "department" || key == "total_count" || key == "total")) {
                                if (finalReport[k].keys.includes(key) == false) {
                                    finalReport[k].keys.push(key);
                                }
                                tempValues.push(parseInt(value / 3));
                            }
                        }
                    }
                    departmentValues.push(tempValues)
                }
                console.log(finalReport, departmentValues);
                for (let k = 0; k < finalReport.length; k++) {
                    for (let i = 0; i < finalReport[k].keys.length; i++) {
                        let value = 0;
                        let index = i;
                        for (let j = 0; j < departmentValues[k].length / finalReport[k].keys.length; j++) {
                            value += departmentValues[k][index];
                            index = index + finalReport[k].keys.length;
                        }
                        finalReport[k].values.push(value);
                    }
                }
                res.send(finalReport);
            }

        });
    }
}


module.exports = GenerateReport;