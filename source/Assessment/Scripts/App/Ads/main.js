"use strict";

$(function () {
    $("#tabs").tabs();

    $.ajax({
        method: "GET",
        url: "/Service/GetAds",
        cache: false,
        datatype: "json",
        success: function (result) {

            fillSamples(result);

        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(jqXhr);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

    var columns = [
        { title: "Ad Id", data: "AdId" },
        { title: "Brand Id", data: "Brand.BrandId" },
        { title: "Brand Name", data: "Brand.BrandName" },
        { title: "Number of Pages", data: "NumPages" },
        { title: "Position", data: "Position" }
    ];

    var columnsFiltered = [
        { title: "Brand Id", data: "BrandId" },
        { title: "Brand Name", data: "BrandName" },
        { title: "Number of Pages", data: "NumPages" },
        { title: "Position", data: "Position" }
    ];

    function fillSamples(data) {

        //Sample 1
        //Sorted already from service call
        fillDataTables("#sample1", data, columns);

        //Sample 2
        //Not need to sorted as it is already sorted from service call
        var sample2Data = _.filter(data, function (e) { return e.Position === "Cover" && e.NumPages >= 0.5; });

        fillDataTables("#sample2", sample2Data, columns);

        //Sample 3
        var top5Sample3Data = _.chain(data).filter(function (e) { return e.Position === "Page" })
            .sortedUniqBy("Brand.BrandName").orderBy(["NumPages"], ["desc"]).take(5).value();

        fillDataTables("#sample3", top5Sample3Data, columns);

        //Sample 4
        var filteredData = [];
        var pageSample4Data = _.chain(data).filter(function (e) { return e.Position === "Page" })
            .groupBy("Brand.BrandName").value();

        _.forOwn(pageSample4Data,
            function (e, key) {
                filteredData.push({
                    BrandId: e[0].Brand.BrandId,
                    BrandName: key,
                    NumPages: _.sumBy(e, "NumPages"),
                    Position: e[0].Position
                });
            });

        var sample4Data = _.chain(filteredData).orderBy(["NumPages"], ["desc"]).take(5).value();

        fillDataTables("#sample4", sample4Data, columnsFiltered);
    }

    function fillDataTables(id, data, cols) {

        $(id).DataTable({
            data: data,
            order: [],
            columns: cols
        });
    }
});