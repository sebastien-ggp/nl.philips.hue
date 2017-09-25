'use strict';

const Homey = require('homey');
const Device = require('../../lib/Device.js');

const buttonEventMap = {
	'1002': 'on',
	'2002': 'increase_brightness',
	'3002': 'decrease_brightness',
	'4002': 'off',
}

class DeviceDimmerSwitch extends Device {
	
	onInit() {
		super.onInit();
		
		this._buttonEvent = undefined;
		this._lastUpdated = undefined;
		
		this._driver = this.getDriver();
		
	}
	
	_onSync() {	
		super._onSync();
		
		this.setCapabilityValue('measure_battery', parseInt(this._device.config.battery));
		
		const lastUpdated = this._device.state.lastUpdated;
		const buttonEvent = this._device.state.buttonEvent;
		
		if( typeof this._buttonEvent === 'undefined' ) {
			this._buttonEvent = this._device.state.buttonEvent;
			this._lastUpdated = this._device.state.lastUpdated;
		} else {

			// if last press changed and button is the same
			if( lastUpdated !== this._lastUpdated && buttonEvent === this._buttonEvent ) {
				this._lastUpdated = lastUpdated;
				
				this._driver.flowCardTrigger.trigger(this, null, {
					button: buttonEventMap[buttonEvent]
				}).then(this.log).catch( this.error );

			}

			// else if the button has changed
			else if( this._buttonEvent !== buttonEvent ) {
				this._buttonEvent = buttonEvent;
				this._lastUpdated = lastUpdated;

				this._driver.flowCardTrigger.trigger(this, null, {
					button: buttonEventMap[buttonEvent]
				}).catch( this.error );

			}
		}
	}
}

module.exports = DeviceDimmerSwitch;