	//■SocketIO関数
	let socket = io();
    socket.on('connect', function() {
        socket.emit('server_echo', {data: 'client connected!'});
    });

	socket.on('client_echo', function(data) {
    	console.log("echo" + ': ' + data.msg);
	}); 

	//room
	const join  = (room) => {socket.emit("join" ,{room:room})};
	const leave = (room) => {socket.emit("leave",{room:room})};
	const send_room = (room,chat_info) => {socket.emit("send_room",{chat_info:chat_info,to:room})};
	
	let chat_area = $("#chat-area");
	socket.on('from_room', function(data) {
    	console.log("from_room" + ': ' + data.msg);
		chat_area.append("<p>" + data.msg + "</p>");
		chat_area.scrollTop(chat_area.get(0).scrollHeight);
	});

	//room-idを初期化
	//なんちゃってRoomIDなので、重複する可能性は充分にある。あくまでも、デモ用
	$("#my-room-id").text(String(Math.random()).slice(2,12));

	let user_name_form = $("#user-name");
	let room_id_form = $("#room-id");
	let chat_text_form = $("#chat-text-form").prop("disabled",true);

	//参加ボタン
	$("#join-btn").click(function(){
		let room_id = room_id_form.val();
		if(room_id === ""){return;}
		user_name_form.prop("readonly",true);
		room_id_form.prop("readonly",true);
		chat_text_form.prop("disabled",false);
		$(this).prop("disabled",true);
		$("#leave-btn").prop("disabled",false);
		console.log("join");
		join(room_id);
		chat_text_form.val("");
		chat_area.text("");
	});

	//退室ボタン
	$("#leave-btn").click(function(){
		let room_id = room_id_form.val();
		if(room_id === ""){return;}
		user_name_form.prop("readonly",false);
		room_id_form.prop("readonly",false);
		chat_text_form.prop("disabled",true);
		$(this).prop("disabled",true);
		$("#join-btn").prop("disabled",false);
		leave(room_id);
		chat_text_form.val("");
		chat_area.text("");
	});

	//送信ボタン
	$("#send-room-btn").click(function(){
		if(chat_text_form.prop("disabled") === true){return;}
		let room_id = room_id_form.val();
		let user_name = user_name_form.val();
		let chat_text = chat_text_form.val();
		send_room(room_id,{msg:chat_text,user_name:user_name})
		chat_text_form.val("");
	});
