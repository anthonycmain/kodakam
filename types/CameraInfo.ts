export default interface CameraInfo {
    ipAddress: string,
    params: URLSearchParams
}

export const getCommands = [
    "get_log",
    "get_all_pos",
    "get_all_versions",
    "get_bitratelimitopt",
    "get_callwait",
    "get_caminfo",
    "get_codelog",
    "get_dev_info",
    "get_flicker",
    "get_motion_source",
    "get_night_vision",
    "get_panel_status",
    "get_repeater_status",
    "get_rt_list",
    "get_setup_log",
    "get_spkmic_volume",
    "get_temp_humid",
    "get_udid",
    "get_version",
    "get_video_bitrate",
    "get_bitrate",
    "get_framerate",
    "get_gop",
    "get_resolution",
    "get_wifi_strength",
    "get_zone_detection",
];

export const allCommands = {
    "CAMERA_SETUP_START_LOG_CMD":"get_log",
    "CHECK_PU_FW_UPGRADE_CMD":"check_pu_fw_upgrade",
    "CLEAR_REPEATER_INFO_CMD":"clear_repeater_info",
    "DNS_CONFIG_CMD":"dns_config",
    "FORCE_FW_UPGRADE_CMD":"check_fw_upgrade",
    "GET_ALL_PTZ_PRESET_CMD":"get_all_pos",
    "GET_ALL_VERSIONS_CMD":"get_all_versions",
    "GET_BITRATE_OPTION_CMD":"get_bitratelimitopt",
    "GET_CALL_WAIT_DURATION_CMD":"get_callwait",
    "GET_CAM_INFO_CMD":"get_caminfo",
    "GET_CAMERA_LOG_CMD":"get_codelog",
    "GET_DEV_INFO_CMD":"get_dev_info",
    "GET_FLICKER_CMD":"get_flicker",
    "GET_FLIPUP_CMD":"value_flipup",
    "GET_MELODY_CMD":"value_melody",
    "GET_MELODY_VOLUME_CMD":"melody_vol",
    "GET_MOTION_SENSITIVE_CMD":"value_motion_sensitivity",
    "GET_MOTION_SOURCE_CMD":"get_motion_source",
    "GET_NIGHT_VISION_CMD":"get_night_vision",
    "GET_PANEL_STATUS_CMD":"get_panel_status",
    "GET_REPEATER_STATUS_CMD":"get_repeater_status",
    "GET_RT_LIST_CMD":"get_rt_list",
    "GET_SETUP_LOG_CMD":"get_setup_log",
    "GET_SPEAKER_VOLUME_CMD":"get_spkmic_volume",
    "GET_TEMPERATURE_AND_HUMIDITY_CMD":"get_temp_humid",
    "GET_TIMER_INFO_CMD":"cinatic_timer",
    "GET_UDID_CMD":"get_udid",
    "GET_VERSION_CMD":"get_version",
    "GET_VIDEO_BITRATE_CMD":"get_video_bitrate",
    "GET_VIDEO_BITRATE_DOORBELL_CMD":"get_bitrate",
    "GET_VIDEO_FRAME_RATE_CMD":"get_framerate",
    "GET_VIDEO_GOP_CMD":"get_gop",
    "GET_VIDEO_RESOLUTION_CMD":"get_resolution",
    "GET_WIFI_STRENGTH_CMD":"get_wifi_strength",
    "GET_ZONE_DETECTION_CMD":"get_zone_detection",
    "HOME_MODE_CMD":"homemode_advise_setting",
    "LOCAL_FW_UPGRADE_CMD":"local_fw_upgrade",
    "MELODY_CMD":"melody%d",
    "MELODY_STOP_CMD":"melodystop",
    "MELODY1_CMD":"melody1",
    "MELODY2_CMD":"melody2",
    "MELODY3_CMD":"melody3",
    "MELODY4_CMD":"melody4",
    "MELODY5_CMD":"melody5",
    "PAIR_STOP_CMD":"pair_stop",
    "PICTURE_MODE_CMD":"set_isp_idx",
    "PLAY_VOICE_PROMPT_CMD":"play_prompt",
    "REMOVE_PTZ_PRESET_CMD":"remove_pos",
    "RESTART_SYSTEM_CMD":"restart_system",
    "SET_AQI_AP_CMD":"set_aqi_detection",
    "SET_AQI_CMD":"set_aqi_detection",
    "SET_BITRATE_OPTION_CMD":"set_bitratelimitopt",
    "SET_BLUE_LED_CMD":"set_blue_led",
    "SET_CALL_WAIT_DURATION_CMD":"set_callwait",
    "SET_CITY_TIMEZONE_CMD":"set_city_timezone",
    "SET_FAN_MODE_CMD":"fan_mode_ctrl",
    "SET_FLICKER_CMD":"set_flicker",
    "SET_FLIPUP_CMD":"set_flipup",
    "SET_HIGH_AQI_THRESH_CMD":"set_aqi_hi_threshold",
    "SET_HIGH_HUMIDITY_THRESH_CMD":"set_humid_hi_threshold",
    "SET_HIGH_TEMPERATURE_AP_THRESH_CMD":"set_temp_hi_threshold",
    "SET_HIGH_TEMPERATURE_THRESH_CMD":"set_temp_hi_threshold",
    "SET_HUMIDITY_AP_CMD":"set_humid_detection",
    "SET_HUMIDITY_CMD":"set_humid_detection",
    "SET_LOW_AQI_THRESH_CMD":"set_aqi_lo_threshold",
    "SET_LOW_HUMIDITY_THRESH_CMD":"set_humid_lo_threshold",
    "SET_LOW_TEMPERATURE_AP_THRESH_CMD":"set_temp_lo_threshold",
    "SET_LOW_TEMPERATURE_THRESH_CMD":"set_temp_lo_threshold",
    "SET_MELODY_VOLUME_CMD":"melody_vol",
    "SET_MOTION_SENSITIVE_CMD":"set_motion_sensitivity",
    "SET_MOTION_SNAP_STORAGE_CMD":"set_motion_snapshot_storage",
    "SET_MOTION_SOURCE_CMD":"set_motion_source",
    "SET_MOTION_STORAGE_CMD":"set_motion_storage",
    "SET_NETWORK_INFO_CMD":"set_nwk_info",
    "SET_NETWORK_INFO_UTF8_CMD":"set_nwk_info_v2",
    "SET_NIGHT_VISION_CMD":"set_night_vision",
    "SET_POWER_CMD":"power_state_set",
    "SET_PTZ_PRESET_CMD":"set_pos",
    "SET_REG_TOKEN_CMD":"set_reg_token",
    "SET_REPEATER_INFO_CMD":"set_repeater_info",
    "SET_SCHEDULE_CMD":"cinatic_scheduler",
    "SET_SDCARD_AUTO_REMOVE_CMD":"auto_rm_clip",
    "SET_SEC_TYPE_CMD":"set_sec_type",
    "SET_SERVER_AUTH_CMD":"set_server_auth",
    "SET_SLEEP_MODE_CMD":"sleep_mode",
    "SET_SOUND_DETECTION_CMD":"set_sound_detection",
    "SET_SPEAKER_VOLUME_CMD":"set_spkmic_volume",
    "SET_TEMPERATURE_AP_CMD":"set_temp_detection",
    "SET_TEMPERATURE_CMD":"set_temp_detection",
    "SET_URL_CMD":"set_url",
    "SET_VIDEO_BITRATE_CMD":"set_video_bitrate",
    "SET_VIDEO_BITRATE_DOORBELL_CMD":"set_bitrate",
    "SET_VIDEO_FRAME_RATE_CMD":"set_framerate",
    "SET_VIDEO_GOP_CMD":"set_gop",
    "SET_VIDEO_RESOLUTION_CMD":"set_resolution",
    "SET_ZONE_DETECTION_CMD":"set_zone_detection",
    "SETUP_WIRELESS_SAVE_CMD":"setup_wireless_save",
    "START_ALL_PTZ_PRESET_CMD":"set_moving_path",
    "START_PTZ_CALIBRATION_CMD":"motor_calibration",
    "START_PTZ_PRESET_CMD":"go_pos",
    "TUNING_LEVEL_CMD":"agc_lvl",
    "UPDATE_WIFI_INFO_CMD":"change_router_info",
    "URL_SET_CMD":"url_set",
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
'flicker':50
'flipup':0
'fliplr':0
'brate':550
'svol':2
'mvol':22
'wifi':82
'bat':14
'hum':-1
'tem':-273
'hum_float':-1.0
'tem_float':-273.0
'storage':1
'md':0:0:3:0
'sd':0:2:3:0
'td':0:3:1529:0
'lbd':1:0:1:0
'ir':0
'lulla':0
'res':720
'sdcap':-113
'sdfree':0
'sdatrm':1
'sdnoclips':10
'mdled':0
'ca':1
'charge':0
'lulvol':3
'isp_idx':1
'agc_lvl':0
'ssid1':Zen 7530
'ssid2':
'ssid3':Zen 7530
'hw_id':6
'puscan':1
'pu_ana_en':1
'rtscan':1
'panel_vox':0
'charge_dur':21
'mvr':1
'dnsm':192.168.178.1
'dnss':80.23.63.0
'wifi_env':100001000000006
'lulla_dur':15
'localip':192.168.178.36
'sync_channel':3
'rp_pair':0
'rp_conn':disconnect
'blue_led_en':1
'blue_led_ontime':180
'red_led_affect':0
'block_pu_upgrade':0
'pu_fw_pkg':00.00.00
'advise_homemode':1
'snapshot_storage':1
'soc_ver':517260
*/