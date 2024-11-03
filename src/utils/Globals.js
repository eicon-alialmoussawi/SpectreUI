export const ApiUrls = {
   //for development
      BaseURL: "https://localhost:44374/api",
      MediaURL: "https://localhost:44374/Media/",
  // //for client and final
   //   BaseURL: "http://95.216.139.227:8097/api",
   //   MediaURL: "http://95.216.139.227:8097/Media/",
  // //for qa
  // BaseURL: "http://95.216.139.227:8092/api",
  // MediaURL: "http://95.216.139.227:8092/Media/",

  // for test
    //  BaseURL: "https://localhost:44374/api",
    //  MediaURL: "https://localhost:44374/Media/",

  //for vps IONOS:
    //  BaseURL: "http://194.164.29.133/api",
    //  MediaURL: "http://194.164.29.133/Media/",

  //for vps IONOS using spectrumpricing.com:
    //  BaseURL: "https://spectrumpricing.com/api",
    //  MediaURL: "https://spectrumpricing.com/Media/",

     //for vps IONOS using spectrumpricing.com:
     //BaseURL: "https://spectre-me.com/api",
    //MediaURL: "https://spectre-me.com/Media/",
     
  // SPECTRE
     //  BaseURL: "https://spectreapidev.ids.com.lb/api",
    //  MediaURL: "https://spectreapidev.ids.com.lb/Media/",
  
};

export var BindNotifications = true;

export function UpdateBindNotificatimport(value) {
  BindNotifications = value;
}
