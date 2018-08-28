const http = require('http');
const StompServer = require('stomp-broker-js');

const locations =
    [{
        "id": "1",
        "name": "Макрорегиональный филиал «Центр»",
        "rf": [{ "id": "100002", "name": "Белгородский" }, { "id": "100009", "name": "Брянский" }, {
            "id": "100010",
            "name": "Ивановский"
        }, { "id": "100011", "name": "Калужский" }, { "id": "100012", "name": "Костромской" }, {
            "id": "100013",
            "name": "Курский"
        }, { "id": "100014", "name": "Липецкий" }, { "id": "100001", "name": "Московский" }, {
            "id": "100100",
            "name": "Москва"
        }, { "id": "100015", "name": "Орловский" }, { "id": "100016", "name": "Рязанский" }, {
            "id": "100017",
            "name": "Смоленский"
        }, { "id": "100005", "name": "Тамбовский" }, { "id": "100007", "name": "Тульский" }, {
            "id": "100006",
            "name": "Тверской"
        }, { "id": "100003", "name": "Владимирский" }, { "id": "100004", "name": "Воронежский" }, {
            "id": "100008",
            "name": "Ярославский"
        }]
    }, {
        "id": "3",
        "name": "Макрорегиональный филиал «Дальний Восток»",
        "rf": [{ "id": "145453", "name": "Амурский филиал" }, { "id": "422677", "name": "ХФ" }, {
            "id": "3016889",
            "name": "ЕAO"
        }, { "id": "49135745", "name": "Хабаровск" }, { "id": "56691205", "name": "Комсомольск" }, {
            "id": "422985",
            "name": "Камчатка"
        }, { "id": "422986", "name": "Магадан" }, { "id": "145354", "name": "Владивосток OLD" }, {
            "id": "2242710",
            "name": "Приморский край"
        }, { "id": "8304095", "name": "Уссурийск old" }, { "id": "19292697", "name": "Фокино old" }, {
            "id": "55559968",
            "name": "Находка old"
        }, { "id": "145458", "name": "Сахалин" }, { "id": "19540745", "name": "Якутск" }, {
            "id": "19558288",
            "name": "Мирный"
        }, { "id": "66666999", "name": "Нерюнгри" }, { "id": "129465882", "name": "Нерюнгри" }, {
            "id": "129478022",
            "name": "Ленск"
        }, { "id": "275291120", "name": "Якутск" }]
    }, {
        "id": "4",
        "name": "Макрорегиональный филиал «Столичный»",
        "rf": [{ "id": "700001", "name": "Москва" }]
    }, {
        "id": "6",
        "name": "Макрорегиональный филиал «Сибирь»",
        "rf": [{ "id": "600002", "name": "МРФСиб Алтайский" }, {
            "id": "600003",
            "name": "МРФСиб Горно-Алтайский"
        }, { "id": "600008", "name": "МРФСиб Бурятский" }, { "id": "600004", "name": "МРФСиб Иркутский" }, {
            "id": "600005",
            "name": "МРФСиб Кемеровский"
        }, { "id": "600006", "name": "МРФСиб Красноярский" }, {
            "id": "600009",
            "name": "МРФСиб Хакасский"
        }, { "id": "600001", "name": "МРФСиб Новосибирский" }, {
            "id": "600007",
            "name": "МРФСиб Омский"
        }, { "id": "600010", "name": "МРФСиб Томский" }, { "id": "600011", "name": "МРФСиб Забайкальский" }]
    }, {
        "id": "7",
        "name": "Макрорегиональный филиал «Юг»",
        "rf": [{ "id": "400002", "name": "Адыгейский" }, { "id": "400003", "name": "Астраханский" }, {
            "id": "400011",
            "name": "Дагестанский"
        }, { "id": "400027", "name": "Ингушский" }, { "id": "400005", "name": "Кабардино-Балкарский" }, {
            "id": "400006",
            "name": "Калмыцкий"
        }, { "id": "400007", "name": "Карачаево-Черкесский" }, {
            "id": "400001",
            "name": "Краснодарский"
        }, { "id": "400008", "name": "Ростовский" }, { "id": "400009", "name": "Северо-Осетинский" }, {
            "id": "400010",
            "name": "Ставропольский"
        }, { "id": "400004", "name": "Волгоградский" }]
    }, {
        "id": "8",
        "name": "Макрорегиональный филиал «Урал»",
        "rf": [{ "id": "1000183", "name": "ЧФЭС" }, { "id": "1000187", "name": "ЕФЭС" }, {
            "id": "1000182",
            "name": "ХМФЭС"
        }, { "id": "1000186", "name": "КФЭС" }, { "id": "1000185", "name": "ПФЭС" }, {
            "id": "1000184",
            "name": "ТФЭС"
        }, { "id": "1000181", "name": "ЯНФЭС" }]
    }, {
        "id": "9",
        "name": "Макрорегиональный филиал «Волга»",
        "rf": [{ "id": "300023", "name": "Республика Башкортостан" }, {
            "id": "300011",
            "name": "Чувашская Республика"
        }, { "id": "300002", "name": "Кировский" }, { "id": "300004", "name": "Республика Мордовия" }, {
            "id": "300003",
            "name": "Республика Марий-Эл"
        }, { "id": "300001", "name": "Нижегородский" }, { "id": "300005", "name": "Оренбургский" }, {
            "id": "300006",
            "name": "Пензенский"
        }, { "id": "300007", "name": "Самарский" }, { "id": "300008", "name": "Саратовский" }, {
            "id": "300012",
            "name": "Республика Татарстан"
        }, { "id": "300009", "name": "Удмуртская Республика" }, { "id": "300010", "name": "Ульяновский" }]
    }, {
        "id": "5",
        "name": "Макрорегиональный филиал «Северо-Запад»",
        "rf": [{ "id": "200003", "name": "Архангельский" }, { "id": "200006", "name": "Калиниградский" }, {
            "id": "200009",
            "name": "Коми филиал"
        }, { "id": "200008", "name": "Карельский" }, { "id": "200004", "name": "Мурманский" }, {
            "id": "200007",
            "name": "Новгородский"
        }, { "id": "200005", "name": "Псковский" }, {
            "id": "200001",
            "name": "Петербургский объединенный"
        }, { "id": "200002", "name": "Вологодский" }]
    }];

class AlertsGenerator {

    constructor() {
        this._alerts = [];
        this._historical = [];
    }

    static randomize(values = []) {
        return values[Math.floor(Math.random() * (values.length - 0.01))];
    }

    raiseAlert() {
        const mrf = AlertsGenerator.randomize(locations);
        const rf = AlertsGenerator.randomize(mrf.rf).id;
        const alert = {
            severity: "CRITICAL",
            type: AlertsGenerator.randomize(['SIMPLE', 'GROUP_AGGREGATION', 'KPIKQI']),
            closed: false,
            duration: 1219232,
            external_id: "",
            id: String(Math.floor(Math.random() * 99999999)),
            mrf: mrf.id,
            notification_status: "WAITING",
            object: "SAN=0303936751094, Л/С=352010230624",
            policy_id: "123ww",
            raise_time: new Date().toISOString(),
            rf,
        };
        this._alerts.push(alert);
        return alert
    }

    ceaseAlert() {
        const alertCount = this._alerts.length;
        if (alertCount > 0) {
            const alert = AlertsGenerator.randomize(this._alerts);
            const index = this._alerts.indexOf(alert);
            if (index > -1) {
                this._alerts.splice(index, 1);
            }
            alert.closed = true;
            this._historical.push(alert);
            return alert
        }
    }

    getAlerts() {
        return this._alerts.concat(this._historical)
    }

    [Symbol.iterator]() {
        const next = () => {
            const select = [this.raiseAlert.bind(this), this.ceaseAlert.bind(this)];
            this._alerts.length > 30 ? select.push(this.ceaseAlert.bind(this)) : select.push(this.raiseAlert.bind(this));
            const alert = AlertsGenerator.randomize(select)();
            return {
                value: alert, done: false
            }
        };
        return { next }
    }
}

module.exports = (app) => {
    console.log('Notifications Plug-In ON');

    const server = http.createServer();
    server.listen(9999);

    const stompServer = new StompServer({ server, path: '/notifications', protocol: 'sockjs' });

    stompServer.subscribe("/alerts", function (msg, headers) {
        const topic = headers.destination;
        console.log(topic, "->", msg);
    });

    stompServer.on('connecting', (a, b) => {

    });

    const alertsGenerator = new AlertsGenerator();
    global.alertsGenerator = alertsGenerator;

    stompServer.on('subscribe', (() => {
        let pinged;
        return () => {
            const ping = () => {
                setTimeout(() => {
                    const max = Math.floor(Math.random() * 4);
                    const alerts = [];
                    let index = 0;
                    for (let alert of alertsGenerator) {
                        alert && alerts.push(alert);
                        ++index;
                        if (index > max) {
                            break
                        }
                    }
                    stompServer.send('/alerts', {}, JSON.stringify({ error: 'NONE', alerts }));
                    ping();
                }, 3000)
            };


            if (!pinged) {
                pinged = true;
                ping()
            }
        }
    })());

};