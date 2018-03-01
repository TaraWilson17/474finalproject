function drawGlobalHeatMap() {
    d3.csv("data/global_heat_index_data.csv", function (error, data) {
        if (error) return console.warn(error);
            data.forEach(function (d) {
                // lol do this
        });
        dataset = data;

        drawVis(dataset);
    });
}