const oracledb = require('oracledb');
oracledb.initOracleClient({configDir: '/oracle/instantclient_19_9/network/admin'});

cns = {
    user: "proyecto",
    password: "1234",
    connectString : "35.224.127.232/ORCL18",
}


async function Open(sql, binds, autoCommit) {
    let cnn = await oracledb.getConnection(cns);
    let result = await cnn.execute(sql, binds, { autoCommit });
    cnn.release();
    return result;
}

exports.Open = Open;