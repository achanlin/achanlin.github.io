/*
 * Copyright 2015 Jason Graves (GodLikeMouse/Collaboradev)
 * http://www.collaboradev.com
 *
 * This file is part of jquery.cube.js.
 *
 * The jquery.cube.js plugin is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * The jquery.cube.js plugin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with the jquery.cube.js plugin. If not, see http://www.gnu.org/licenses/.
 */

$.fn.cube = function(options){

	var _defaultOptions = {
		position: {
			x: 0,
			y: 0,
			ox: 100,
			oy: 0,
		},
		size: {
			width: 250,
			height: 250
		},
	
		color: [
			"red",    //front 
			"green",  //right 
			"orange", //rear 
			"blue",   //blue
			"yellow", //top 
			"white"   //bottom 
		],
		
		animation: {
			delay: 500
		}
	};

    options = $.extend(_defaultOptions, options);

    var _ref = this;

    var _cube = [];

    //method for parsing moves string into individual moves
    function parse(moves){

        var allowed = ["U","u","R","r","D","d","L","l","F","f","B","b","M","E","S","X","Y","Z","2","'","H", "I", "J", "K"];

        //clean unnecessary moves
        moves = moves
            .replace(/\(/gm,"")
            .replace(/\)/gm,"")
            .replace(/\[/gm,"")
            .replace(/\]/gm,"")
            .replace(/\n/gm," ");

        //replace old algorithm notation
        //Fw, Bw, Rw, Lw, Uw, Dw
        moves = moves
            .replace(/Fw/gm, "f")
            .replace(/Bw/gm, "b")
            .replace(/Rw/gm, "r")
            .replace(/Lw/gm, "l")
            .replace(/Uw/gm, "u")
            .replace(/Dw/gm, "d")
            .replace(/x/gm, "X")
            .replace(/y/gm, "Y")
            .replace(/z/gm, "Z");

        var m = moves.split(" ");
        var parsed = [];
        for(var i=0; i<m.length; i++){
            var move = m[i];

            //sanity check max length
            if(move.length == 0 || move.length > 5)
                continue;

            //sanity check move notation
            var sane = true;
            for(var j=0; j<move.length; j++){
                var segment = move[j];
                if($.inArray(segment, allowed) < 0){
                    sane = false;
                    break;
                }
            }

            if(!sane)
                continue;

            //check for numeric moves like U2' and B2
            //transform into separate moves
            //U2' => U' U'
            var repeat = move[1];
            if($.isNumeric(repeat)){
                move = move.replace(move[1], "");
                while(repeat--){
                    parsed.push(move);
                }
            }
            else{
                parsed.push(move);
            }

        }

        return parsed;
    }

    //method for positioning cubits according to
    //the cubit data pos
    function positionCubits(cubits, animate){

        var index = 0;
        var length = cubits.length;
	
        $(cubits).each(function(){
            var cubit = $(this);
            var pos = cubit.data("pos");

            if(animate){

                //animated move
                var translate3d = "translate3d(" + pos.x + "px," + pos.y + "px," + pos.z + "px)";
                var ox = 0;
                var oy = 0;
                var oz = 0;

                cubit.animate({
                    rotateX: pos.ox,
                    rotateY: pos.oy,
                    rotateZ: pos.oz
                },
                {
                    duration: options.animation.delay,
                    step: function(now, fx){
                            switch(fx.prop){
                                case "rotateX":
                                    ox = now;
                                    break;

                                case "rotateY":
                                    oy = now;
                                    break;

                                case "rotateZ":
                                    oz = now;
                                    break;
                            }

                        cubit.css({
                            transform: "rotateX(" + ox + "deg) rotateY(" + oy + "deg) rotateZ(" + oz + "deg) " + translate3d
                        });
                    },
                    complete: function(){

                        //restore back to original rotation
                        cubit
                            .animate({
                            rotateX: 0,
                            rotateY: 0,
                            rotateZ: 0
                        }, 0)
                            .css({
                            transform: "rotateX(0deg) rotateY(0deg) rotateZ(0deg) " + translate3d
                        });

                        //wait until all cubits have moved
                        index++;

                        if(index == length){

                            //begin next command
                            _ref.trigger("next-move");
                        }
                    }
                });

            }
            else{
                //non-animated move
                cubit.css({
                    transform: "rotateX(" + pos.ox + "deg) rotateY(" + pos.oy + "deg) rotateZ(" + pos.oz + "deg) translate3d(" + pos.x + "px," + pos.y + "px," + pos.z + "px)"
                });
            }
        });

    }

    //method for updating cubit colors
    //from array => to array
	function updateCubitColors(){

		var from = _ref.data("from");
		var to = _ref.data("to");

		if(!from || !to)
			return;

        //build new colors to be applied
        var paint = [];
        $(to).each(function(){
            paint.push({
                f1: $(this).find(".f1").css("background-color"),
                f2: $(this).find(".f2").css("background-color"),
                f3: $(this).find(".f3").css("background-color"),
                f4: $(this).find(".f4").css("background-color"),
                f5: $(this).find(".f5").css("background-color"),
                f6: $(this).find(".f6").css("background-color")
            });
        });

        //apply new colors
        $(from).each(function(){
            var p = paint.shift();
            $(this).find(".f1").css("background-color", p.f1);
			$(this).find(".f2").css("background-color", p.f2);
			$(this).find(".f3").css("background-color", p.f3);
			$(this).find(".f4").css("background-color", p.f4);
			$(this).find(".f5").css("background-color", p.f5);
			$(this).find(".f6").css("background-color", p.f6);
        });
	}

    //method for retrieving cubits by layer
    //specifying plane x, y, z
    //and depth 0, 1, 2, 3,4
    //for example:
    // U layer is
    //      plane: y
    //      depth: 0
    // R layer is
    //      plane: x
    //      depth: 5
    // B layer is
    //      plane: z
    //      depth: 0
    function getCubits(plane, depth){
        switch(plane){
            case "y":
                switch(depth){
                    case 0:
                        return [
                              _cube[0].get(0),   _cube[1].get(0),   _cube[2].get(0),   _cube[3].get(0),   _cube[4].get(0),
                             _cube[25].get(0),  _cube[26].get(0),  _cube[27].get(0),  _cube[28].get(0),  _cube[29].get(0),
                             _cube[50].get(0),  _cube[51].get(0),  _cube[52].get(0),  _cube[53].get(0),  _cube[54].get(0),
							 _cube[75].get(0),  _cube[76].get(0),  _cube[77].get(0),  _cube[78].get(0),  _cube[79].get(0),
							_cube[100].get(0), _cube[101].get(0), _cube[102].get(0), _cube[103].get(0), _cube[104].get(0)
                        ];
                    case 1:
                        return [
                            _cube[5].get(0),  _cube[6].get(0),  _cube[7].get(0),  _cube[8].get(0),  _cube[9].get(0),
                            _cube[30].get(0), _cube[31].get(0), _cube[32].get(0), _cube[33].get(0), _cube[34].get(0),
                            _cube[55].get(0), _cube[56].get(0), _cube[57].get(0), _cube[58].get(0), _cube[59].get(0),
							_cube[80].get(0), _cube[81].get(0), _cube[82].get(0), _cube[83].get(0), _cube[84].get(0),
							_cube[105].get(0), _cube[106].get(0), _cube[107].get(0), _cube[108].get(0), _cube[109].get(0)
                        ];
                    case 2:
                        return [
                            _cube[10].get(0), _cube[11].get(0), _cube[12].get(0), _cube[13].get(0), _cube[14].get(0),
                            _cube[35].get(0), _cube[36].get(0), _cube[37].get(0), _cube[38].get(0), _cube[39].get(0),
                            _cube[60].get(0), _cube[61].get(0), _cube[62].get(0), _cube[63].get(0), _cube[64].get(0),
							_cube[85].get(0), _cube[86].get(0), _cube[87].get(0), _cube[88].get(0), _cube[89].get(0),
							_cube[110].get(0), _cube[111].get(0), _cube[112].get(0), _cube[113].get(0), _cube[114].get(0)
                        ];
					case 3:
						return [
							_cube[15].get(0), _cube[16].get(0), _cube[17].get(0), _cube[18].get(0), _cube[19].get(0),
							_cube[40].get(0), _cube[41].get(0), _cube[42].get(0), _cube[43].get(0), _cube[44].get(0),
							_cube[65].get(0), _cube[66].get(0), _cube[67].get(0), _cube[68].get(0), _cube[69].get(0),
							_cube[90].get(0), _cube[91].get(0), _cube[92].get(0), _cube[93].get(0), _cube[94].get(0),
							_cube[115].get(0), _cube[116].get(0), _cube[117].get(0), _cube[118].get(0), _cube[119].get(0)
						];
					case 4:
						return [
							_cube[20].get(0), _cube[21].get(0), _cube[22].get(0), _cube[23].get(0), _cube[24].get(0),
							_cube[45].get(0), _cube[46].get(0), _cube[47].get(0), _cube[48].get(0), _cube[49].get(0),
							_cube[70].get(0), _cube[71].get(0), _cube[72].get(0), _cube[73].get(0), _cube[74].get(0),
							_cube[95].get(0), _cube[96].get(0), _cube[97].get(0), _cube[98].get(0), _cube[99].get(0),
							_cube[120].get(0), _cube[121].get(0), _cube[122].get(0), _cube[123].get(0), _cube[124].get(0)
						];
                }
            case "x":
                switch(depth){
                  case 0:
                        return [
                            _cube[20].get(0),  _cube[15].get(0),  _cube[10].get(0),   _cube[5].get(0),   _cube[0].get(0),
                            _cube[45].get(0), _cube[40].get(0),   _cube[35].get(0),   _cube[30].get(0),  _cube[25].get(0),
                            _cube[70].get(0), _cube[65].get(0),   _cube[60].get(0),   _cube[55].get(0),  _cube[50].get(0),
							_cube[95].get(0), _cube[90].get(0),   _cube[85].get(0),   _cube[80].get(0),  _cube[75].get(0),
							_cube[120].get(0), _cube[115].get(0), _cube[110].get(0),  _cube[105].get(0), _cube[100].get(0)
                        ];
                    case 1:
                        return [
                            _cube[21].get(0),  _cube[16].get(0),  _cube[11].get(0),  _cube[6].get(0),  _cube[1].get(0),
                            _cube[46].get(0), _cube[41].get(0), _cube[36].get(0), _cube[31].get(0), _cube[26].get(0),
                            _cube[71].get(0), _cube[66].get(0), _cube[61].get(0), _cube[56].get(0), _cube[51].get(0),
							_cube[96].get(0), _cube[91].get(0), _cube[86].get(0), _cube[81].get(0), _cube[76].get(0),
							_cube[121].get(0), _cube[116].get(0), _cube[111].get(0), _cube[106].get(0), _cube[101].get(0)
                        ];
                    case 2:
                        return [
                            _cube[22].get(0), _cube[17].get(0), _cube[12].get(0), _cube[7].get(0), _cube[2].get(0),
                            _cube[47].get(0), _cube[42].get(0), _cube[37].get(0), _cube[32].get(0), _cube[27].get(0),
                            _cube[72].get(0), _cube[67].get(0), _cube[62].get(0), _cube[57].get(0), _cube[52].get(0),
							_cube[97].get(0), _cube[92].get(0), _cube[87].get(0), _cube[82].get(0), _cube[77].get(0),
							_cube[122].get(0), _cube[117].get(0), _cube[112].get(0), _cube[107].get(0), _cube[102].get(0)
                        ];
					case 3:
						return [
							_cube[23].get(0), _cube[18].get(0), _cube[13].get(0), _cube[8].get(0), _cube[3].get(0),
							_cube[48].get(0), _cube[43].get(0), _cube[38].get(0), _cube[33].get(0), _cube[28].get(0),
							_cube[73].get(0), _cube[68].get(0), _cube[63].get(0), _cube[58].get(0), _cube[53].get(0),
							_cube[98].get(0), _cube[93].get(0), _cube[88].get(0), _cube[83].get(0), _cube[78].get(0),
							_cube[123].get(0), _cube[118].get(0), _cube[113].get(0), _cube[108].get(0), _cube[103].get(0)
						];
					case 4:
						return [
							_cube[24].get(0), _cube[19].get(0), _cube[14].get(0), _cube[9].get(0), _cube[4].get(0),
							_cube[49].get(0), _cube[44].get(0), _cube[39].get(0), _cube[34].get(0), _cube[29].get(0),
							_cube[74].get(0), _cube[69].get(0), _cube[64].get(0), _cube[59].get(0), _cube[54].get(0),
							_cube[99].get(0), _cube[94].get(0), _cube[89].get(0), _cube[84].get(0), _cube[79].get(0),
							_cube[124].get(0), _cube[119].get(0), _cube[114].get(0), _cube[109].get(0), _cube[104].get(0)
						];
                }
            case "z":
                switch(depth){
                    case 0:
                        return [
                            _cube[20].get(0),  _cube[21].get(0),  _cube[22].get(0),  _cube[23].get(0),  _cube[24].get(0),
                            _cube[15].get(0), _cube[16].get(0), _cube[17].get(0), _cube[18].get(0), _cube[19].get(0),
                            _cube[10].get(0), _cube[11].get(0), _cube[12].get(0), _cube[13].get(0), _cube[14].get(0),
							_cube[5].get(0), _cube[6].get(0), _cube[7].get(0), _cube[8].get(0), _cube[9].get(0),
							_cube[0].get(0), _cube[1].get(0), _cube[2].get(0), _cube[3].get(0), _cube[4].get(0)
                        ];
                    case 1:
                        return [
                            _cube[45].get(0),  _cube[46].get(0),  _cube[47].get(0),  _cube[48].get(0),  _cube[49].get(0),
                            _cube[40].get(0), _cube[41].get(0), _cube[42].get(0), _cube[43].get(0), _cube[44].get(0),
                            _cube[35].get(0), _cube[36].get(0), _cube[37].get(0), _cube[38].get(0), _cube[39].get(0),
							_cube[30].get(0), _cube[31].get(0), _cube[32].get(0), _cube[33].get(0), _cube[34].get(0),
							_cube[25].get(0), _cube[26].get(0), _cube[27].get(0), _cube[28].get(0), _cube[29].get(0)
                        ];
                    case 2:
                        return [
                            _cube[70].get(0), _cube[71].get(0), _cube[72].get(0), _cube[73].get(0), _cube[74].get(0),
                            _cube[65].get(0), _cube[66].get(0), _cube[67].get(0), _cube[68].get(0), _cube[69].get(0),
                            _cube[60].get(0), _cube[61].get(0), _cube[62].get(0), _cube[63].get(0), _cube[64].get(0),
							_cube[55].get(0), _cube[56].get(0), _cube[57].get(0), _cube[58].get(0), _cube[59].get(0),
							_cube[50].get(0), _cube[51].get(0), _cube[52].get(0), _cube[53].get(0), _cube[54].get(0)
                        ];
					case 3:
						return [
							_cube[95].get(0), _cube[96].get(0), _cube[97].get(0), _cube[98].get(0), _cube[99].get(0),
							_cube[90].get(0), _cube[91].get(0), _cube[92].get(0), _cube[93].get(0), _cube[94].get(0),
							_cube[85].get(0), _cube[86].get(0), _cube[87].get(0), _cube[88].get(0), _cube[89].get(0),
							_cube[80].get(0), _cube[81].get(0), _cube[82].get(0), _cube[83].get(0), _cube[84].get(0),
							_cube[75].get(0), _cube[76].get(0), _cube[77].get(0), _cube[78].get(0), _cube[79].get(0)
						];
					case 4:
						return [
							_cube[120].get(0), _cube[121].get(0), _cube[122].get(0), _cube[123].get(0), _cube[124].get(0),
							_cube[115].get(0), _cube[116].get(0), _cube[117].get(0), _cube[118].get(0), _cube[119].get(0),
							_cube[110].get(0), _cube[111].get(0), _cube[112].get(0), _cube[113].get(0), _cube[114].get(0),
							_cube[105].get(0), _cube[106].get(0), _cube[107].get(0), _cube[108].get(0), _cube[109].get(0),
							_cube[100].get(0), _cube[101].get(0), _cube[102].get(0), _cube[103].get(0), _cube[104].get(0)
						];
                }
        }
    }
    //method for generating the to array from
    //a set of cubits and the move direction
    function generateToArray(cubits, move){

        if(move == "cw"){
            //clockwise
            return [
				cubits[20],  cubits[15],  cubits[10],  cubits[5], cubits[0],
				cubits[21],  cubits[16],  cubits[11],  cubits[6], cubits[1],
				cubits[22],  cubits[17],  cubits[12],  cubits[7], cubits[2],
				cubits[23],  cubits[18],  cubits[13],  cubits[8], cubits[3],
				cubits[24],	 cubits[19],  cubits[14],  cubits[9], cubits[4]
            ];
        }

        //counter clockwise
        return [
				cubits[4], cubits[9], cubits[14], cubits[19], cubits[24],
				cubits[3], cubits[8], cubits[13], cubits[18], cubits[23],
                cubits[2], cubits[7], cubits[12], cubits[17], cubits[22],
                cubits[1], cubits[6], cubits[11], cubits[16], cubits[21],
                cubits[0], cubits[5], cubits[10], cubits[15], cubits[20]
            ];
    }

    //method for orienting cubits
	function orientCubits(){

		//reorient cubits
        var from = _ref.data("from");
        if(!from) return;

        $(from).each(function(){
            var cubit = $(this);
			var pos = cubit.data("pos");
            var f1 = cubit.find(".f1");
            var f2 = cubit.find(".f2");
            var f3 = cubit.find(".f3");
            var f4 = cubit.find(".f4");
            var f5 = cubit.find(".f5");
            var f6 = cubit.find(".f6");

            //Y Layer
			switch(pos.oy){
				case -90: //clockwise turn
					var temp = f1.css("background-color");
					f1.css("background-color", f2.css("background-color"));
					f2.css("background-color", f3.css("background-color"));
					f3.css("background-color", f4.css("background-color"));
					f4.css("background-color", temp);
					break;

                case 90: //counter clockwise turn
					var temp = f4.css("background-color");
					f4.css("background-color", f3.css("background-color"));
					f3.css("background-color", f2.css("background-color"));
					f2.css("background-color", f1.css("background-color"));
					f1.css("background-color", temp);
                    break;
			}

            //X Layer
			switch(pos.ox){
                case -90: //counter clockwise turn
					var temp = f1.css("background-color");
					f1.css("background-color", f5.css("background-color"));
					f5.css("background-color", f3.css("background-color"));
					f3.css("background-color", f6.css("background-color"));
					f6.css("background-color", temp);
					break;

				case 90: //clockwise turn
					var temp = f1.css("background-color");
					f1.css("background-color", f6.css("background-color"));
					f6.css("background-color", f3.css("background-color"));
					f3.css("background-color", f5.css("background-color"));
					f5.css("background-color", temp);
					break;
			}

            //Z Layer
			switch(pos.oz){
                case -90: //counter clockwise turn
					var temp = f5.css("background-color");
					f5.css("background-color", f2.css("background-color"));
					f2.css("background-color", f6.css("background-color"));
					f6.css("background-color", f4.css("background-color"));
					f4.css("background-color", temp);
					break;

				case 90: //clockwise turn
					var temp = f5.css("background-color");
					f5.css("background-color", f4.css("background-color"));
					f4.css("background-color", f6.css("background-color"));
					f6.css("background-color", f2.css("background-color"));
					f2.css("background-color", temp);
					break;
			}

            pos.ox = 0;
            pos.oy = 0;
            pos.oz = 0;
		});
	}

    //method for executing a single move/turn
	_ref.turn = function(move, rotation){

		switch(move){
			case "U":
                var from = getCubits("y", 0);
                var to = generateToArray(from, "cw");

				_ref.data("from", from);
				_ref.data("to", to);

                $(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = -90;
				});

				break;

            case "U'":
                var from = getCubits("y", 0);
                var to = generateToArray(from, "ccw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = 90;
				});

				break;

            case "u":
                var f1 = getCubits("y", 0);
                var f2 = getCubits("y", 1);
                var from = f1.concat(f2);

				var t1 = generateToArray(f1, "cw")
                var t2 = generateToArray(f2, "cw");
                var to = t1.concat(t2);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = -90;
				});

				break;

            case "u'":
				var f1 = getCubits("y", 0);
                var f2 = getCubits("y", 1);
                var from = f1.concat(f2);

                var t1 = generateToArray(f1, "ccw")
                var t2 = generateToArray(f2, "ccw");
                var to = t1.concat(t2);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = 90;
				});

				break;

			case "R":
                var from = getCubits("x", 4);
                var to = generateToArray(from, "ccw");

				_ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = 90;
				});

				break;

            case "R'":
				var from = getCubits("x", 4);
                var to = generateToArray(from, "cw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = -90;
				});

				break;

            case "r":
				var f1 = getCubits("x", 4);
                var f2 = getCubits("x", 3);
                var from = f1.concat(f2);

                var t1 = generateToArray(f1, "ccw")
                var t2 = generateToArray(f2, "ccw");
                var to = t1.concat(t2);

				_ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = 90;
				});

				break;

            case "r'":
				var f1 = getCubits("x", 4);
                var f2 = getCubits("x", 3);
                var from = f1.concat(f2);

                var t1 = generateToArray(f1, "cw")
                var t2 = generateToArray(f2, "cw");
                var to = t1.concat(t2);

				_ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = -90;
				});

				break;

			case "D":
                var from = getCubits("y", 4);
                var to = generateToArray(from, "ccw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = 90;
				});

				break;

            case "D'":
                var from = getCubits("y", 4);
                var to = generateToArray(from, "cw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = -90;
				});

				break;

            case "d":
				var f1 = getCubits("y", 4);
                var f2 = getCubits("y", 3);
                var from = f1.concat(f2);

                var t1 = generateToArray(f1, "ccw");
                var t2 = generateToArray(f2, "ccw");
                var to = t1.concat(t2);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = 90;
				});

				break;

            case "d'":
				var f1 = getCubits("y", 4);
                var f2 = getCubits("y", 3);
                var from = f1.concat(f2);

                var t1 = generateToArray(f1, "cw");
                var t2 = generateToArray(f2, "cw");
                var to = t1.concat(t2);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = -90;
				});

				break;

			case "L":
				var from = getCubits("x", 0);
                var to = generateToArray(from, "cw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = -90;
				});

				break;

			case "L'":
				var from = getCubits("x", 0);
                var to = generateToArray(from, "ccw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = 90;
				});

				break;

            case "l":
				var f1 = getCubits("x", 0);
                var f2 = getCubits("x", 1);
                var from = f1.concat(f2);

                var t1 = generateToArray(f1, "cw")
                var t2 = generateToArray(f2, "cw");
                var to = t1.concat(t2);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = -90;
				});

				break;

            case "l'":
				var f1 = getCubits("x", 0);
                var f2 = getCubits("x", 1);
                var from = f1.concat(f2);

                var t1 = generateToArray(f1, "ccw")
                var t2 = generateToArray(f2, "ccw");
                var to = t1.concat(t2);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = 90;
				});

				break;

			case "F":
				var from = getCubits("z", 4);
                var to = generateToArray(from, "ccw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = 90;
				});

				break;

			case "F'":
				var from = getCubits("z", 4);
                var to = generateToArray(from, "cw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = -90;
				});

				break;

            case "f":
				var f1 = getCubits("z", 4);
                var f2 = getCubits("z", 3);
                var from = f1.concat(f2);

                var t1 = generateToArray(f1, "ccw")
                var t2 = generateToArray(f2, "ccw");
                var to = t1.concat(t2);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = 90; //this is a mistake from auther, it should be 90, auther written as -90
				});

				break;

            case "f'":
				var f1 = getCubits("z", 4);
                var f2 = getCubits("z", 3);
                var from = f1.concat(f2);

                var t1 = generateToArray(f1, "cw")
                var t2 = generateToArray(f2, "cw");
                var to = t1.concat(t2);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = -90;
				});

				break;

			case "B":
				var from = getCubits("z", 0);
                var to = generateToArray(from, "cw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = -90;
				});

				break;

			case "B'":
				var from = getCubits("z", 0);
                var to = generateToArray(from, "ccw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = 90;
				});

				break;

            case "b":
				var f1 = getCubits("z", 0);
                var f2 = getCubits("z", 1);
                var from = f1.concat(f2);

                var t1 = generateToArray(f1, "cw")
                var t2 = generateToArray(f2, "cw");
                var to = t1.concat(t2);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = -90;
				});

				break;

            case "b'":
				var f1 = getCubits("z", 0);
                var f2 = getCubits("z", 1);
                var from = f1.concat(f2);

                var t1 = generateToArray(f1, "ccw")
                var t2 = generateToArray(f2, "ccw");
                var to = t1.concat(t2);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = 90;
				});

				break;

            case "M":
				var from = getCubits("x", 2);
                var to = generateToArray(from, "cw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = -90;
				});

				break;

            case "M'":
				var from = getCubits("x", 2);
                var to = generateToArray(from, "ccw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = 90;
				});

				break;

            case "E'":
				var from = getCubits("y", 2);
                var to = generateToArray(from, "cw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = -90;
				});

				break;

            case "E":
				var from = getCubits("y", 2);
                var to = generateToArray(from, "ccw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = 90;
				});

				break;

            case "S":
				var from = getCubits("z", 2);
                var to = generateToArray(from, "ccw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = 90;
				});

				break;

            case "S'":
				var from = getCubits("z", 2);
                var to = generateToArray(from, "cw");

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = -90;
				});

				break;

            case "X":
            	
				var f0 = getCubits("x", 4);
                var f1 = getCubits("x", 3);
                var f2 = getCubits("x", 2);
                var f3 = getCubits("x", 1);
				var f4 = getCubits("x", 0);
                var from = f0.concat(f1).concat(f2).concat(f3).concat(f4);
				
				var t0 = generateToArray(f0, "ccw");
                var t1 = generateToArray(f1, "ccw");
                var t2 = generateToArray(f2, "ccw");
                var t3 = generateToArray(f3, "ccw");
				var t4 = generateToArray(f4, "ccw");
                var to = t0.concat(t1).concat(t2).concat(t3).concat(t4);

				_ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = 90;
				});

				break;

            case "X'":
         		var f0 = getCubits("x", 4);
                var f1 = getCubits("x", 3);
                var f2 = getCubits("x", 2);
                var f3 = getCubits("x", 1);
				var f4 = getCubits("x", 0);
                var from = f0.concat(f1).concat(f2).concat(f3).concat(f4);
				
				var t0 = generateToArray(f0, "cw");
                var t1 = generateToArray(f1, "cw");
                var t2 = generateToArray(f2, "cw");
                var t3 = generateToArray(f3, "cw");
				var t4 = generateToArray(f4, "cw");
                var to = t0.concat(t1).concat(t2).concat(t3).concat(t4);

				_ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.ox = -90;
				});

                break;

            case "Y":
				var f0 = getCubits("y", 0);
                var f1 = getCubits("y", 1);
                var f2 = getCubits("y", 2);
                var f3 = getCubits("y", 3);
				var f4 = getCubits("y", 4);
                var from = f0.concat(f1).concat(f2).concat(f3).concat(f4);
				
				var t0 = generateToArray(f0, "cw");
				var t1 = generateToArray(f1, "cw");
                var t2 = generateToArray(f2, "cw");
                var t3 = generateToArray(f3, "cw");
			    var t4 = generateToArray(f4, "cw");
	   			var to = t0.concat(t1).concat(t2).concat(t3).concat(t4);
				
	            _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = -90;
				});

				break;

            case "Y'":
 				var f0 = getCubits("y", 0);
                var f1 = getCubits("y", 1);
                var f2 = getCubits("y", 2);
                var f3 = getCubits("y", 3);
				var f4 = getCubits("y", 4);
                var from = f0.concat(f1).concat(f2).concat(f3).concat(f4);
				
				var t0 = generateToArray(f0, "ccw");
				var t1 = generateToArray(f1, "ccw");
                var t2 = generateToArray(f2, "ccw");
                var t3 = generateToArray(f3, "ccw");
				var t4 = generateToArray(f4, "ccw");
                var to = t0.concat(t1).concat(t2).concat(t3).concat(t4);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = 90;
				});

				break;

            case "Z":
				var f0 = getCubits("z", 0);
                var f1 = getCubits("z", 1);
                var f2 = getCubits("z", 2);
                var f3 = getCubits("z", 3);
				var f4 = getCubits("z", 4);
                var from = f0.concat(f1).concat(f2).concat(f3).concat(f4);
				
				var t0 = generateToArray(f0, "cw");
				var t1 = generateToArray(f1, "cw");
                var t2 = generateToArray(f2, "cw");
                var t3 = generateToArray(f3, "cw");
				var t4 = generateToArray(f4, "cw");
                var to = t0.concat(t1).concat(t2).concat(t3).concat(t4);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = -90;
				});

				break;

            case "Z'":
				var f0 = getCubits("z", 0);
                var f1 = getCubits("z", 1);
                var f2 = getCubits("z", 2);
                var f3 = getCubits("z", 3);
				var f4 = getCubits("z", 4);
                var from = f0.concat(f1).concat(f2).concat(f3).concat(f4);
				
				var t0 = generateToArray(f0, "ccw");
				var t1 = generateToArray(f1, "ccw");
                var t2 = generateToArray(f2, "ccw");
                var t3 = generateToArray(f3, "ccw");
				var t4 = generateToArray(f4, "ccw");
                var to = t0.concat(t1).concat(t2).concat(t3).concat(t4);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oz = 90;
				});

				break;

		case "H":
				var f1 = getCubits("y", 4);
                var f2 = getCubits("y", 3);
                var f3 = getCubits("y", 2);
		        var from = f1.concat(f2).concat(f3);
				
				var t1 = generateToArray(f1, "ccw");
                var t2 = generateToArray(f2, "ccw");
                var t3 = generateToArray(f3, "ccw");
	            var to = t1.concat(t2).concat(t3);
				
				_ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = 90;
				});

				break;
  

        case "I":
				var f1 = getCubits("y", 4);
                var f2 = getCubits("y", 3);
				var f3 = getCubits("y", 2);
                var from = f1.concat(f2).concat(f3);

                var t1 = generateToArray(f1, "cw");
                var t2 = generateToArray(f2, "cw");
				var t3 = generateToArray(f3, "cw");
				
                var to = t1.concat(t2).concat(t3);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = -90;
				});

				break;
				
				
		case "J":
                var f1 = getCubits("y", 0);
                var f2 = getCubits("y", 1);
				var f3 = getCubits("y", 2);
                var from = f1.concat(f2).concat(f3);

				var t1 = generateToArray(f1, "cw")
                var t2 = generateToArray(f2, "cw");
				var t3 = generateToArray(f3, "cw");
                var to = t1.concat(t2).concat(t3);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = -90;
				});

				break;

        case "K":
				var f1 = getCubits("y", 0);
                var f2 = getCubits("y", 1);
				var f3 = getCubits("y", 2);
                var from = f1.concat(f2).concat(f3);

                var t1 = generateToArray(f1, "ccw");
                var t2 = generateToArray(f2, "ccw");
				var t3 = generateToArray(f3, "ccw");
                var to = t1.concat(t2).concat(t3);

                _ref.data("from", from);
				_ref.data("to", to);

				$(from).each(function(){
					var pos = $(this).data("pos");
					pos.oy = 90;
				});

				break;		
				
            default:
                return;
		}

        positionCubits(from, true);
	}

    //method for executing a set of moves
	_ref.execute = function(moves){

        //parse moves from notation into individual moves
        moves = parse(moves);
        console.info(moves);

		_ref.data("move-stack", moves);
		_ref.trigger("next-move");
	}

	_ref.on("next-move", function(e){

        //color cubits according to new orientation
        orientCubits();

        //copy colors from array => to array
        updateCubitColors();

        _ref.data("from", null);
        _ref.data("to", null);

        var moves = _ref.data("move-stack");
        if(!moves)
            return;

        console.info("moves", moves);

        var move = moves.shift();

        if(!move)
            moves = null;

        _ref.data("move-stack", moves);

        if(move)
            _ref.turn(move);
	})

    //method for creating the cubit
	function createCubit(point){

        //create cubit
		var cubit = $("<div>")
			.addClass("cubit")
			.css({
				width: options.cubit.width + "px",
				height: options.cubit.height + "px"
			});
		_ref.append(cubit);

        //create cubit faces
		for(var i=0; i<6; i++){
			var face = $("<div>")
				.addClass("face f" + (i+1))
                .css({
                    width: options.cubit.width + "px",
                    height: options.cubit.height + "px"
                });
			cubit.append(face);

            //place face
            switch(i){
                case 0:
                    face.css({
                        transform: "translateZ(" + (options.cubit.width/2) + "px)"
                    });
                    break;

                case 1:
                    face.css({
                        left: (options.cubit.width/2) + "px",
                        transform: "rotateY(90deg)"
                    })
                    break;

                case 2:
                    face.css({
                        transform: "translateZ(" + (-(options.cubit.width/2)) + "px) rotateY(180deg)"
                    })
                    break;

                case 3:
                    face.css({
                        left: -(options.cubit.width/2) + "px",
                        transform: "rotateY(-90deg)"
                    })
                    break;

                case 4:
                    face.css({
                        top: -(options.cubit.width/2) + "px",
                        transform: "rotateX(90deg)"
                    })
                    break;

                case 5:
                    face.css({
                        top: (options.cubit.width/2) + "px",
                        transform: "rotateX(90deg) rotateY(180deg)"
                    })
                    break;
					

            }

			//face.text(_cube.length);
		}

		cubit.data("pos", point);
		//cubit.css({transition: "all " + options.animation.delay});

		_cube.push(cubit);

		return cubit;
	}

    //method for painting the cube faces
	function paintFaces(){
		for(var i=0; i<_cube.length; i++){
			var cubit = _cube[i];

			for(var j=0; j<6; j++){
				cubit.find(".f" + (j+1)).css("background-color", options.color[j]);
			}
		}
	}

function createCube(){
	
		options.cubit = {
			width: options.size.width/5,
			height: options.size.height/5
		};
	
		for(var z=-2*options.cubit.width; z<options.cubit.width*3; z+=options.cubit.width){

			for(var i=0; i<25; i++){

				var point = {
					x: 0,
					y: 0,
					z: z,
					ox: 0,
					oy: 0,
					oz: 0
				};
	

				switch(i){
					case 0:
						point.x -= 2*options.cubit.width;
						point.y -= 2*options.cubit.height;
						break;

					case 1:
						point.x -= options.cubit.width;
						point.y -= 2*options.cubit.height;
						break;

					case 2:
					
						point.y -= 2*options.cubit.height;
						break;

					case 3:
						point.x += options.cubit.width;
						point.y -= 2*options.cubit.height;
						break;

					case 4:
						point.x += 2*options.cubit.width;
						point.y -= 2*options.cubit.height;
						break;


					case 5:
						point.x -= 2*options.cubit.width;
						point.y -= options.cubit.height;
						break;

					case 6:
						point.x -= options.cubit.width;
						point.y -= options.cubit.height;
						break;

					case 7:
					
						point.y -= options.cubit.height;
						break;

					case 8:
						point.x += options.cubit.width;
						point.y -= options.cubit.height;
						break;
						
					case 9:
						point.x += 2*options.cubit.width;
						point.y -= options.cubit.height;
						break;
						
					case 10:
						point.x -= 2*options.cubit.width;
					
						break;
					
					case 11:
						point.x -= options.cubit.width;
				
						break;
					
					case 12:
				
						break;
					
					case 13:
						point.x += options.cubit.width;
					
						break;
					
					case 14:
						point.x += 2*options.cubit.width;
					
						break;
						
					case 15:
						point.x -= 2*options.cubit.width;
						point.y += options.cubit.height;
						break;

					case 16:
						point.x -= options.cubit.width;
						point.y += options.cubit.height;
						break;

					case 17:
				
						point.y += options.cubit.height;
						break;

					case 18:
						point.x += options.cubit.width;
						point.y += options.cubit.height;
						break;
						
					case 19:
						point.x += 2*options.cubit.width;
						point.y += options.cubit.height;
						break;	

					case 20:
						point.x -= 2*options.cubit.width;
						point.y += 2*options.cubit.height;
						break;

					case 21:
						point.x -= options.cubit.width;
						point.y += 2*options.cubit.height;
						break;

					case 22:
					
						point.y += 2*options.cubit.height;
						break;

					case 23:
						point.x += options.cubit.width;
						point.y += 2*options.cubit.height;
						break;

					case 24:
						point.x += 2*options.cubit.width;
						point.y += 2*options.cubit.height;
						break;						
				}

				createCubit(point);
			}
		}

        //set initial cubit positions
        positionCubits(_ref.find(".cubit"), false);

        //color cubit faces
		paintFaces();
	}
	
	//method for retrieving the living options 
	_ref.getOptions = function(){
		return options;
	}
	
	createCube();
    _ref.data("_cube", _ref);

	return _ref;

}