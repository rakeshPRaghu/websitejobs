var request = require('request');
const fs = require('fs');

const url = "https://openebs.devstats.cncf.io/api/ds/query";

const getdatesForContribution = () => {
    var today = new Date();
    var priorDate = new Date();
    priorDate.setDate(priorDate.getDate() - 30);
    return {
      today,
      priorDate,
      todayTimestamp: today.valueOf(),
      priorDateTimestamp: priorDate.valueOf(),
    };
  };
const reqBodyToFetchContributors = {
  queries: [
    {
      refId: "A",
      datasourceId: 1,
      rawSql:
        "select\n  row_number() over (order by value desc) as \"Rank\",\n  name,\n  value\nfrom\n  shpr_auth\nwhere\n  series = 'hpr_authall'\n  and period = 'm'",
      format: "table",
      intervalMs: 86400000,
      maxDataPoints: 1255,
    },
  ],
  range: {
    from: `${getdatesForContribution().priorDate}`,
    to: `${getdatesForContribution().today}`,
    raw: {
      from: "now-1m",
      to: "now",
    },
  },
  from: `${getdatesForContribution().priorDateTimestamp}`,
  to: `${getdatesForContribution().todayTimestamp}`,
};

const settings = {
    url  : "https://openebs.devstats.cncf.io/api/ds/query",
    method: "POST",
    json: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: reqBodyToFetchContributors
  };
function loadNew(){
    request.post(settings,function (error, response, body){
          console.log(body?.results?.A?.frames[0]?.data?.values[1]);
          const data = JSON.stringify(body?.results?.A?.frames[0]?.data?.values[1])
          fs.writeFileSync('src/resources/contributors.json',data);
  });
  
    // .then((res) => res.json())
    // .then((json) => {
    //     console.log(json?.results?.A?.frames[0]?.data?.values[1]);
    //     const data = JSON.stringify(json?.results?.A?.frames[0]?.data?.values[1])
    //     fs.writeFileSync('src/resources/contributors.json',data);
    // });
    
    
}

loadNew();