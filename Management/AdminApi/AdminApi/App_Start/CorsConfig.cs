using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Thinktecture.IdentityModel.Http.Cors.WebApi;

namespace AdminApi.App_Start
{
    public class CorsConfig
    {
        public static void RegisterCors(HttpConfiguration httpConfig)
        {
            WebApiCorsConfiguration corsConfig = new WebApiCorsConfiguration();

            // this adds the CorsMessageHandler to the HttpConfiguration's
            // MessageHandlers collection
            corsConfig.RegisterGlobal(httpConfig);
            corsConfig
                    .ForAllOrigins()
                  .AllowAll();
        }
    }
}