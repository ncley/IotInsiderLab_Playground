using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using AdminApi.App_Start;
using AdminApi.Service;
using Autofac;
using Autofac.Integration.WebApi;
using Thinktecture.IdentityModel.Http.Cors;
using Thinktecture.IdentityModel.Http.Cors.IIS;
using Thinktecture.IdentityModel.Http.Cors.Mvc;

namespace AdminApi
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            CorsConfig.RegisterCors(GlobalConfiguration.Configuration);
            RegisterCors(MvcCorsConfiguration.Configuration);
            ConfigureCors(UrlBasedCorsConfiguration.Configuration);

            var builder = new ContainerBuilder();
            var config = GlobalConfiguration.Configuration;
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterWebApiFilterProvider(config);
            builder.RegisterInstance(new ActivationService()).SingleInstance();
            // Set the dependency resolver to be Autofac.
            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }

        private void RegisterCors(MvcCorsConfiguration corsConfig)
        {
            corsConfig
                .ForAllOrigins()
                .AllowAll();
        }

        void ConfigureCors(CorsConfiguration corsConfig)
        {
            corsConfig
            .ForAllOrigins()
            .AllowAll();
        }
    }
}
