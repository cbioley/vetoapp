import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';

export default class Vote extends Component {

  static propTypes = {
    setVote: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    veto: PropTypes.object.isRequired,
    vote: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.onVetoCancelClick = this.onVetoCancelClick.bind(this);
    this.onVetoClick = this.onVetoClick.bind(this);
  }

  onVetoCancelClick() {
    const { veto, setVote } = this.props;
    setVote(veto.id, false);
  }

  onVetoClick() {
    const { veto, setVote } = this.props;
    setVote(veto.id, true);
  }

  render() {
    const { vote } = this.props;

    return (
      vote && vote.yes ?
        <div>
          <div className="alert alert-success" role="alert">
            <strong>Děkujeme!</strong> Hlasoval jste pro veto
            zákona.
          </div>
          <p>
            Pokud se nás zde sejde 50 tisíc, můžeme se bavit o tom,
            zda-li je zákon ještě <a
              target="_blank"
              href="https://cs.wikipedia.org/wiki/Legitimita#Legitimita_ve_filosofii"
            >legitimní</a>.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={this.onVetoCancelClick}
          >Rozmyslel jsem si to.</button>
        </div>
      :
        <div>
          <div className="alert alert-info" role="alert">
            Pokud si myslíte, že zákon je zbytečný, vetujte ho.
          </div>
          <button
            className="btn btn-primary"
            onClick={this.onVetoClick}
          >Vetovat zákon</button>
        </div>
    );
  }

}
