

const mysql = require('mysql');



exports.index = () => {
    return {

        sql: async function (sql) {
            const connection = mysql.createConnection(Config.sql);

            connection.connect();

            function query() {
                return new Promise((res, rej) => (
                    connection.query(sql, function (error, results, fields) {
                        if (error) {
                            res({ error: error.sqlMessage })
                            return
                        };
                        res(results)

                    })
                )
                )
            }
            return query()



        }
    }

}

