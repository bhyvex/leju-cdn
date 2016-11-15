
'use strict';

const http   = require('http');
const crypto = require('crypto');

module.exports = {
	save(contents) {
        //内部接口
        /*var savereq = http.request({
            host: 'admin.imgcdn.leju.com',
            path: '/imgcdn/api/index',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': contents.length
            }
        })
        savereq.write(contents);
        savereq.end();*/
    },
    fresh : (() => {
    	let hash,
    		date,
            _this = this;
    	let getHash = (data) => {
    		let md5 = crypto.createHash('md5');
		    md5.update(data);
		    return hash = "W/" + md5.digest('hex').slice(0,8);
    	}

    	let lastModified = (data) => {
            let index = ~data.indexOf("</ljtime>***/") ? data.indexOf("</ljtime>***/") : 0;
            let sdata = data.slice(0,index);
    		return date = sdata ? new Date(sdata.replace(/\/(\*)+\<(ljtime)\>/,'')).toUTCString() : new Date().toUTCString();
    	}

    	let check = (req,data) => {
            let isold = false;
    		/*if(req.headers['if-none-match'] && req.headers['if-none-match'] === getHash(data)){
		    	isold = true;
		    }*/
		    if(req.headers['if-modified-since'] && req.headers['if-modified-since'] === lastModified(data)){
		    	isold = true;
		    }
		    return isold;
    	}
    	return (req,data,cb) => {
    		try{
    			cb(null,check(req,data),hash,date)
    		}catch(e){
    			cb(e)
    		}
    	}
    }()),
    getUrl(path){
    	let parr = path.match(/(.+\.\w+)(\?)(.+)/);
    	return (!parr || (~['r','c','s','l'].indexOf(parr[3]))) ? path : parr[1]
    },
    getTime(){
        return new Date(+new Date()+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
    }
}