const tables = require ('./tables');
const sql = require ("better-sqlite3");
const path = require('path');
const fs = require ('fs');

const sqlfile = path.join(global.system.mainpath, `${global.config.datapath}/database.db`);
const cachefile = path.join(global.system.mainpath, `${global.config.datapath}/cache-sql.txt`);

function checktables () {
    var db = new sql(sqlfile);
    tables.forEach(table=> {
        var intable = "";
        table.intable.forEach (o => {
            intable+=`${o.name} ${o.type} ${o.params},`
        });
        intable = intable.slice(0,-1);
        sql_run = `CREATE TABLE IF NOT EXISTS ${table.name} (${intable})`

        var tableset = db.prepare(sql_run);
        // console.log(sql_run);
        tableset.run();
    });

    db.close();
}

var tablejs = path.join(global.system.mainpath, '/cores/database/tables.js');

if (!fs.existsSync(cachefile)) {
    var f = fs.statSync(tablejs);
    fs.writeFileSync(cachefile, f.size.toString());
    checktables();
} else {
    var bf = fs.readFileSync(cachefile);
    var f = fs.statSync(tablejs);

    if (f.size !== bf) {
        fs.writeFileSync(cachefile, f.size.toString());
        checktables();
    }
}

module.exports.tables = (name=false) => {
    if (!name) {
        var list =[];
        for (let o =0; o < tables.length; o++) {
            list.push (tables[o].name);
        }
        return list;
    }
    var table = tables.find(o=>o.name==name);
    if (!table || table.length==0) return false;
    return {
        info: () =>{
            return table.intable;
        },
        intable: (dtn) => {
            var tinfo = table.intable.find(o=>o.name==dtn);
            return tinfo;
        }
    }
}

function correctdata (type, data) {
    if (type=="INTEGER" || type=="NUMBER") return Number(data);
    if (type=="TEXT") return `'${data}'`;
    if (type=="BOOLEAN") return Boolean(data);
}

module.exports.update = (name) => {
    if (!this.tables(name)) return false;
    const db = new sql(sqlfile);
    var target = [];
    var sett = [];
    return {
        target: (tname,tdata) => {
            if (tname instanceof Array) {
                for (let i = 0; i < tname.length; i++) {
                    var gettype = this.tables(name).intable(tname[i]).type;
                    var correct = correctdata(gettype,tdata[i]);
                    target.push(`${tname[i]} = ${correct}`);
                }
            } else {
                var gettype = this.tables(name).intable(tname).type;
                var correct = correctdata(gettype,tdata);
                target.push(`${tname} = ${correct}`);
            }
            return {
                set: (tname, tdata) => {
                    var gettype1 = this.tables(name).intable(tname).type;
                    var correct1 = correctdata(gettype1,tdata);
                    sett.push(`${tname} = ${correct1}`);
                },
                save: () => {
                    db.prepare(`UPDATE ${name} SET ${sett.join(",")} WHERE ${target.join("AND")}`).run();
                    db.close();
                }
            }
        }
    }
}

module.exports.select = (name, params={}) => {
    var target = "*";
    var statement = "";
    if (params.target) target = params.target.join(",");
    if (params.state) statement = ` ${params.state}`;

    if (!this.tables(name)) return false;
    var db = new sql (sqlfile);

    var table = db.prepare(`SELECT ${target} FROM ${name}${statement}`);

    var tdata = table.all();
    var count = tdata.length || 0;
    if (params.target && params.target[0].includes('count(')) count = tdata[0][params.target[0]];

    return {
        all: tdata || [],
        find: (where, data) => {
            return tdata.find(o=>o[where]==data) || [];
        },
        filter: (where, data) => {
            return tdata.filter(o=>o[where]===data) || [];
        },
        count: count
    }
}

module.exports.insert = (name) => {
    if (!this.tables(name)) return false;
    return {
        target: (tnames=[]) => {
            var tname = tnames.join(",");
            var tdatas = [];
            return {
                add: (tdata=[]) => {
                    if (tdata.length==tnames.length) { 
                        newtdata=[];
                        for (let o = 0; o < tnames.length; o++) {
                            var type = this.tables(name).intable(tnames[o]).type;
                            newtdata.push (correctdata(type, tdata[o]));
                        }
                        tdatas.push (newtdata);
                        return true;
                    } else return false;
                },
                sqlcode: () => {
                    var tdatass = "";
                    tdatas.forEach(o=>{
                        tdatass+=`(${o.join(",")}),`
                    });

                    tdatass = tdatass.slice(0,-1);
                    return `INSERT INTO ${name} (${tname}) VALUES ${tdatass}`
                },
                save: () => {
                    var tdatass = "";
                    tdatas.forEach(o=>{
                        tdatass+=`(${o.join(",")}),`
                    });

                    tdatass = tdatass.slice(0,-1);

                    var db = new sql (sqlfile);
                    var table = db.prepare (`INSERT INTO ${name} (${tname}) VALUES ${tdatass}`);
                    var end = table.run();
                    db.close();

                    if (tdatas.length == 1) return end.lastInsertRowid;
                    else return false;
                }
            }
        }
    }
}

module.exports.sqlfile = sqlfile;

module.exports.delete = (name, params) => {
    var db = new sql(sqlfile);

    var state = "";
    if (params.state) state = ` ${params.state}`;
    var query = `DELETE FROM ${name}`
    return {
        run: () => {
            var ready = db.prepare (`${query}${state}`);
            ready.run();
            db.close();
            return true;
        }
    }
}