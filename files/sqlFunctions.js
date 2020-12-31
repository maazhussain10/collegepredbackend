const connection = require('./connection');
const {
    response
} = require('express');

//------------------------------------------------Get Time For Last Modified.-------------------------------------------------------------------

function getTime() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const seconds = today.getSeconds()
    return yyyy + '-' + mm + '-' + dd + " " + hour + ':' + minute + ':' + seconds;
}


/* *************************************************************************************************************************************************** */
/* *************************************************************USER DETAILS ************************************************************************************ */
/* *************************************************************************************************************************************************** */

exports.generateReport = (query) => {
    let sql = `${query}`;
    return new Promise(resolve => {
        connection.query(sql, (err, results) => {
            if (err) console.log(err);
            else {
                resolve(results);
            }
        })
    })
}




exports.generateUniqueReport = (table, departments) => {
    return new Promise(async resolve => {
        let temp = []
        for (let i = 0; i < departments.length; i++) {
            let sql = `select * from ${table} where department= '${departments[i]}';`;
            let data = await this.generateReportList(sql);
            temp.push(data);
        }
        resolve(temp)
    })

}

exports.generateReportList = (sql) => {
    return new Promise(resolve => {
        connection.query(sql, (err, results) => {
            if (err)
                console.log(err);
            else {
                resolve(results)
            }
        })
    })
}



exports.schoolName = (tableName) => {
    let sql = `select * from ${tableName};`;
    return new Promise(resolve => {
        connection.query(sql, (err, results) => {
            if (err) console.log(err);
            else {
                resolve(results);
            }
        })
    })
}