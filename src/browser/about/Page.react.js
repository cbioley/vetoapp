import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';

class Page extends Component {

  static propTypes = {
    msg: PropTypes.object
  };

  render() {
    const { msg } = this.props;

    return (
      <div className="me-page">
        <Helmet title={msg.app.links.about} />
        <div className="row">
          <div className="col-md-8">
            <FormattedHTMLMessage defaultMessage={msg.home.infoText} />
            <h2>no tldr;</h2>
            <p>
              Zamysleli jste se někdy nad tím, proč zrovna v politice se musíte
              spokojit s balíčkováním nesouvisejících věcí, a to dokonce na
              čtyři roky? Kdyby se tak kromě politiky měl řídit i váš soukromý
              život – dokázali byste si mezi pěti šesti čtyřletými plány vybrat?
            </p>
            <p>
              Modří by vám nabízeli dvě dovolené ročně, červení jednu, ale zato
              větší. Modří by vám nabízeli, že budete jezdit ve fiatu, červení
              by stáli za škodovkou, zelení by samozřejmě nabízeli prius. Podle
              červených byste směli pít jenom červené víno, modří by vás omezili
              pouze na modrého portugala. O bílém vínu se traduje, že lidem moc
              chutná a vede k opilosti, proto by ho nenabízela žádná strana.
            </p>
            <p>
              Dokážete si představit žít takovýhle život, omezený prolobbovaným
              zbožím, které propagují jednotlivé strany? Takový život by nestál
              ani za starou bačkoru. Tak proč se s tím máme spokojit v politice?
            </p>
            <p>
              Jak spolu souvisí výše daní, legalizace marihuany, homosexuální
              svatby, Evropská unie nebo radar v Brdech? Velmi, velmi volně.
              Tak proč bychom nemohli o každé této věci hlasovat zvlášť, místo
              toho, aby nám strany diktovaly, že když jsme pro radar v Brdech,
              musíme být zároveň proti marihuaně, a když už jsme náhodou pro
              obojí, musíme logicky chtít vysoké daně. PROČ?!
            </p>
            <p>
              Lidové veto vám nabízí šanci toto změnit. Pokud parlamentem projde
              zákon, se kterým většina lidí nesouhlasí, zamítnou ho. Důležité
              je, že budou hlasovat právě o tom jednom zákonu, nikoliv o balíčku
              stovek zákonů jako v regulérních volbách.
            </p>
            <p>
              V minulých sněmovních volbách volilo přes pět miliónů voličů.
              Domnívá se snad někdo, že sedm stran zastoupených ve Sněmovně
              dobře agreguje zájmy těchto pěti miliónů voličů? To sotva.
            </p>
            <p>
              Lidové veto vám nabízí možnost to změnit. Stačí sehnat 50 tisíc
              voličů, kteří si přejí o zákonu uspořádat referendum. Proč právě
              50 tisíc? Toto číslo se osvědčilo ve Švýcarsku. 50 tisíc je
              dostatečně nízká hranice na to, aby se o každém špatném zákonu
              debatovalo a hlasovalo, a naopak dostatečně vysoká hranice na to,
              aby nemuseli voliči běhat k urnám každý týden, i přes to, že jasná
              většina z nich daný zákon podporuje.
            </p>
            <p>
              Znamená to, že při nasbírání 50 tisíc podpisů je zákon automaticky
              mrtvý? Vůbec ne. Znamená to, že 50 tisíc lidí (což je 50krát méně,
              než kolik je potřeba na většinu v regulérních volbách) si žádá,
              aby předkladatelé tohoto zákona předstoupili před občany a výhody
              tohoto zákona vysvětlili. Zde už se neschovají za „volební sliby“,
              „dohodu demokratických stran“, „očekávání zahraničních partnerů“,
              „požadavek Evropské unie“ nebo za jiný oblíbený fíkový list,
              kterým před veřejností zakrývají svoje zákulisní dohody, kdy modří
              podpoří červeným zvýšení daní na oplátku za to, že červení podpoří
              modrým zvýšení platů učitelů.
            </p>
            <p>
              Prostě budou muset přijít před voliče a obhájit tento konkrétní
              zákon. Najde se 50 tisíc lidí, kteří si budou chtít vyslechnout
              pečlivé zdůvodnění zákona zvyšujícího daně, zavádějícího kontrolní
              hlášení DPH, elektronickou evidenci tržeb nebo třeba církevní
              restituce?
            </p>
            <p>
              My věříme, že ano. Učiníme tak politiku mnohem transparentnější.
            </p>
          </div>
        </div>
      </div>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg
}))(Page);
