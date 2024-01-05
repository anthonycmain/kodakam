export default interface CameraInfo {
    ipAddress: string,
    params: URLSearchParams
}

/*
/?req=get_caminfo
get_caminfo: flicker=50&flipup=0&fliplr=0&brate=550&svol=2&mvol=22&wifi=78&bat=14&hum=-1&tem=-273&hum_float=-1.0&tem_float=-273.0&storage=1&md=0:0:3:0&sd=0:2:3:0&td=0:3:1529:0&lbd=1:0:1:0&ir=0&lulla=0&res=720&sdcap=-113&sdfree=0&sdatrm=1&sdnoclips=10&mdled=0&ca=1&charge=0&lulvol=3&isp_idx=1&agc_lvl=0&ssid1=Zen+7530&ssid2=&ssid3=Zen+7530&hw_id=6&puscan=1&pu_ana_en=1&rtscan=1&panel_vox=0&charge_dur=105&mvr=1&dnsm=192.168.178.1&dnss=208.20.63.0&wifi_env=300000000000001&lulla_dur=15&localip=192.168.178.36&sync_channel=3&rp_pair=0&rp_conn=disconnect&blue_led_en=1&blue_led_ontime=180&red_led_affect=0&block_pu_upgrade=0&pu_fw_pkg=00.00.00&advise_homemode=1&snapshot_storage=1&soc_ver=517260&

/?req=get_temp_humid
get_temp_humid: -1

/?req=get_mac_address
get_mac_address: E048AF020DC4

/?req=get_pu_signal_strength
get_pu_signal_strength: 100

/?req=get_session_key
get_session_key: Invalid mode (null)

/?req=get_url
get_url: api=api-t01-r3.perimetersafe.com&mqtt=mqtt-t01-r3.perimetersafe.com:8894&stun=stun-t01-r3.perimetersafe.com&rms=rms-t01-r3.perimetersafe.com&ana=pool.ntp.org&ntp=mt-t01-r3.perimetersafe.com:9100

?req=motor_left&time=1
motor_left: -2

/*
/?req=melody_vol &value=2
/?req=melody_vol (show volume)
/?req=melody_vol&value=3 (set volume (0 - 5))
/?req=melody1&duration=1 (melody 1-5 and duration 1=5 2=10 3=15)
/?req=melodystop (melody stop)

/?req=set_flipup&value=1 (1=ceiling mount, 0 normal.)

/?req=set_flicker&value=50 (value in hertz 50 or 60)

/?req=set_night_vision&value=0 (0=auto, 1=on, 2=off)

/?req=set_motion_source&value=0&schedule=0 (0=off, 1=on, )

/?req=set_motion_sensitivity&value=1 (low=1, medium=3, high=5)

/?req=set_motion_storage&value=1 (1=cloud, 0=SD)

/?req=set_motion_snapshot_storage&value=1 (1=cloud upload, 0=off)

/?req=auto_rm_clip&value=0&clips=10 (0=don’t delete 1=delete)

/?req=set_sound_detection&value=0&sensitivity=1&schedule=0 (0=off, 1=on, )

/?req=set_sound_detection&value=1&sensitivity=3 (1=low, 3=medium, 5=high)

/?req=set_temp_detection&value=0&type=3 (0=off, 1=on)

/?req=set_resolution&value=480 (480=normal. 720=HD)

/?req=set_blue_led&enable=0&on_time=180&red_led_affect=0 (0=off, 1=on)

/?req=homemode_advise_setting&interval=1440&threshold=20&enable=1 (0=disable, 1=enable)

/?req=pair_stop&silence=1 (restart camera)

req=set_sec_type&value=1

/?req=get_session_key&mode=local&port1=55390&ip=xxx.xxx.xxx.xxx&streamname=C9CBBB22B6E94B43DDD160209C2XXX_8

?req=motor_left&time=1

/?req=change_router_info&ssid=MYWIFI&password=TEST
*/



/*
'flicker':	50
'flipup':	0
'fliplr':	0
'brate':	550
'svol':	2
'mvol':	22
'wifi':	82
'bat':	14
'hum':	-1
'tem':	-273
'hum_float':	-1.0
'tem_float':	-273.0
'storage':	1
'md':	0:0:3:0
'sd':	0:2:3:0
'td':	0:3:1529:0
'lbd':	1:0:1:0
'ir':	0
'lulla':	0
'res':	720
'sdcap':	-113
'sdfree':	0
'sdatrm':	1
'sdnoclips':	10
'mdled':	0
'ca':	1
'charge':	0
'lulvol':	3
'isp_idx':	1
'agc_lvl':	0
'ssid1':	Zen 7530
'ssid2':	
'ssid3':	Zen 7530
'hw_id':	6
'puscan':	1
'pu_ana_en':	1
'rtscan':	1
'panel_vox':	0
'charge_dur':	21
'mvr':	1
'dnsm':	192.168.178.1
'dnss':	80.23.63.0
'wifi_env':	100001000000006
'lulla_dur':	15
'localip':	192.168.178.36
'sync_channel':	3
'rp_pair':	0
'rp_conn':	disconnect
'blue_led_en':	1
'blue_led_ontime':	180
'red_led_affect':	0
'block_pu_upgrade':	0
'pu_fw_pkg':	00.00.00
'advise_homemode':	1
'snapshot_storage':	1
'soc_ver':	517260
*/