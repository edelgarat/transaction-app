let trans = [];
let id = 0;
let createTrans = (value,type,date=+new Date()) => {
	trans.push({ id, value, type, date });
	id++;
}

createTrans(1000,"plus",+new Date(2017,2,3));
createTrans(10,"minus",+new Date(2017,2,4));
createTrans(200,"minus",+new Date(2017,3,5));
createTrans(2000,"plus",+new Date(2017,3,6));
createTrans(1500,"minus",+new Date(2017,4,7));
createTrans(200,"minus",+new Date(2017,4,8));
createTrans(100,"minus",+new Date(2017,5,9));
createTrans(100,"plus",+new Date(2017,5,10));
createTrans(150,"minus",+new Date(2017,2,11));

export default trans;
