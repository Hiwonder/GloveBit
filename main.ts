/*
 glovebit package
*/
//% weight=10 icon="\uf7b5" color=#f99000
namespace glovebit {

    const I2C_ADDR = 0x35

    let led_value = 0

    export enum knob_id {
        //% block="thumb"
        Knob_1 = 0x00,
        //% block="forefinger"
        Knob_2 = 0x01,
        //% block="middle finger"
        Knob_3 = 0x02,
        //% block="ring finger"
        Knob_4 = 0x03,
        //% block="little finger"
        Knob_5 = 0x04
    }

    export enum led_id {
        //% block="LED 1"
        led_1 = 0x01,
        //% block="LED 2"
        led_2 = 0x02,
        //% block="LED 3"
        led_3 = 0x04,
        //% block="LED 4"
        led_4 = 0x08,
        //% block="LED 5"
        led_5 = 0x10,
        //% block="all LED"
        led_all = 0x1f,
    }

    export enum led_status {
        //% block="turn on"
        turn_on = 0x01,
        //% block="turn off"
        turn_off = 0x02
    }

    function i2cwrite(reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(I2C_ADDR, buf);
    }

    function i2cread(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt8BE);
        return val;
    }
    /**
     * Glovebit finger knob value
    */
    //% weight=100 blockId=get_knob_value block="Get %finger knob value(0~255)"
    export function get_knob_value(finger: knob_id): number {
        return i2cread(finger)
    }


    /**
     * Glovebit battery value
    */
    //% weight=90 blockId=get_battery_value block="Get battery value(mV)"
    export function get_battery_value(): number {
        let low = i2cread(0x10)
        let high = i2cread(0x11)

        return high * 256 + low
    }

    /**
     * Glovebit control LED
    */
    //% weight=80 blockId=control_led block="%status %led"
    export function control_led(status: led_status, led: led_id) {
        if (status == led_status.turn_on)
        {
            led_value |= led
        }
        else
        {
            led_value &= ~led
        }
        i2cwrite(0x20, led_value)
    }
}
