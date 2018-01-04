using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;
using Assessment.AdService;
using Microsoft.Ajax.Utilities;

namespace Assessment.Controllers
{
    public class ServiceController : Controller
    {
        readonly DateTime _startDate = new DateTime(2011, 1, 1);
        readonly DateTime _endDate = new DateTime(2011, 4, 1);

        [HttpGet]
        public async Task<ActionResult> GetAds()
        {
            IEnumerable<Ad> ads;

            using (var svc = new AdDataServiceClient())
            {
                ads = await svc.GetAdDataByDateRangeAsync(_startDate, _endDate);
                ads = ads.OrderBy(x => x.Brand.BrandName);
            }

            return Json(ads, JsonRequestBehavior.AllowGet);
        }
    }
}