/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set(0, Math.PI, 0);

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var attachedHandheld = null;
	var handheldOnClick = null;
	var handheldEndClick = null;

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );
	yawHeight = 10;

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var isOnObject = false;
	canJump = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x += movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onMouseClick = function ( event ) {

		// TODO: fire raycaster
		if(attachedHandheld.onClick != undefined) {
			attachedHandheld.onClick();
		}
	}

	var onEndClick = function ( event ) {

		if(handheldOnClick != undefined) {
			handheldOnClick();
		}
	}

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 10;
				canJump = false;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'mousedown', onMouseClick, false);
	document.addEventListener( 'mouseup', onEndClick, false);
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.addHandheld = function( handheld, onClickEvent, onEndClick ) {

		handheld.model.rotation.set(0, Math.PI, 0);
		handheld.model.position.set(-10, -4, 10);
		pitchObject.add(handheld.model);
		attachedHandheld = handheld;
	}

	this.getObject = function () {

		return yawObject;

	};

	this.getObjectHeight = function() {
		return yawHeight;
	}

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	this.update = function ( delta, y_diff) {

		if ( scope.enabled === false ) return;

		delta *= 0.1;

		velocity.x += ( - velocity.x ) * 50.00 * delta;
		velocity.z += ( - velocity.z ) * 50.00 * delta;

		velocity.y -= 200 * delta;

		if ( moveForward ) velocity.z += 120 * delta;
		if ( moveBackward ) velocity.z -= 120 * delta;

		if ( moveLeft ) velocity.x += 120 * delta;
		if ( moveRight ) velocity.x -= 120 * delta;

		// TODO: Add gun bob for movement

		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );

		}

		if(y_diff != undefined) {
			yawHeight += y_diff;
		}

		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y );
		yawObject.translateZ( velocity.z );

		if ( yawObject.position.y < yawHeight ) {

			velocity.y = 0;
			yawObject.position.y = yawHeight;

			canJump = true;

		}

		if(attachedHandheld.update != undefined) {
			attachedHandheld.update();
		}

	};

};
