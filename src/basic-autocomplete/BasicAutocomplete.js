import React from 'react'
import Downshift from 'downshift'

class BasicAutocomplete extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      titles: [],
      items: []
    }
    this.searchAutoCompleteChange = this.searchAutoCompleteChange.bind(this);
    this.movieSelectedHandler = this.movieSelectedHandler.bind(this);
  }

  searchAutoCompleteChange(event) {
    if(event.target.value !== undefined && event.target.value.trim() !== '') {
      fetch("https://api.themoviedb.org/3/search/movie?query="+event.target.value+"&api_key=cfe422613b250f702980a3bbf9e90716")
      .then(response => response.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        let results = response.results;
        let titles = results.map(result => result.title);
        let items = results.map(result => {
          return {
            item: result.title,
            id: result.id
          };
        });

        this.setState({
          items: items,
          titles: titles
        })
      });
    }
  }

  movieSelectedHandler(event) {
    this.downshift.selectItem(event.target.innerHTML);
    this.props.onChange({title: event.target.innerHTML, id: event.target.attributes.movieid.nodeValue});
  }

  stateReducer(state, changes) {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          isOpen: state.isOpen,
          highlightedIndex: state.highlightedIndex,
        }
      default:
        return changes
    }
  }

  render() {
    return (
      <Downshift
        ref = { (input) => this.downshift = input }
        render={({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex,
        }) => (
          <div>
            <input
              {...getInputProps({placeholder: 'Search movie here...'})}
              className="small-caps movie-search-box form-control"
              onKeyDown={this.searchAutoCompleteChange}
              ref={ (input) => this.searchMovieBox = input }
            />
            {isOpen ?  (
              <div className="autocomplete-ul">
                {this.state.items
                  .filter(
                    i =>
                      !inputValue ||
                      i.item.toLowerCase().includes(inputValue.toLowerCase()),
                  )
                  .map(({item, id}, index) => (
                    <div
                      {...getItemProps({item})}
                      key={id}
                      movieid={id}
                      onClick={this.movieSelectedHandler}
                      className="autocomplete-menu-item"
                    >
                      {item}
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        )}
      />
    )
  }
}

export default BasicAutocomplete
