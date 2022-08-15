import React from 'react';

import './autocomplete.scss';

export interface AutocompleteProperties<T> {
  value?: T;
  url: string;
  displayFunc: (item: T) => string;
  keyFunc: (item: T) => string;
  onSelect: (item: T) => void;
  onEscapeCallback?: () => void;
}

export interface AutocompleteState<T> {
  activeSuggestion: number;
  filteredSuggestions: Array<T>;
  showSuggestions: boolean;
  userInput: string;
}

export class Autocomplete<T> extends React.Component<
  AutocompleteProperties<T>,
  AutocompleteState<T>
> {
  constructor(props: AutocompleteProperties<T>) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: '',
    };
  }

  onSelect(item: T) {
    this.setState({
      activeSuggestion: 0,
      showSuggestions: false,
      userInput: this.props.displayFunc(item),
    });

    this.props.onSelect(item);
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({
        userInput: this.props.displayFunc(this.props.value),
      });
    }
  }

  async onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const userInput = e.currentTarget.value;
    this.setState({
      userInput: e.currentTarget.value,
    });

    const url = `${this.props.url}${userInput}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.log(`Failed to fetch autocomplete results: ${response.status}`);
      return;
    }

    const suggestions = (await response.json()) as T[];
    const filteredSuggestions = suggestions.slice(0, 10);

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: filteredSuggestions,
      showSuggestions: true,
    });
  }

  onKeyDown = (e: React.KeyboardEvent) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      this.onSelect(this.state.filteredSuggestions[activeSuggestion]);
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      const newSuggestion = activeSuggestion - 1;

      this.setState({
        activeSuggestion: newSuggestion,
        userInput: this.props.displayFunc(filteredSuggestions[newSuggestion]),
      });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      const newSuggestion = activeSuggestion + 1;
      this.setState({
        activeSuggestion: newSuggestion,
        userInput: this.props.displayFunc(filteredSuggestions[newSuggestion]),
      });
    } else if (e.keyCode === 27) {
      this.setState({
        showSuggestions: false,
      });

      this.props.onEscapeCallback && this.props.onEscapeCallback();
    }
  };

  render() {
    const {
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions" data-testid="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = 'suggestion-active';
              }

              return (
                <li
                  className={className}
                  key={this.props.keyFunc(suggestion)}
                  onClick={(e) => this.onSelect(suggestion)}
                >
                  {this.props.displayFunc(suggestion)}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions" data-testid="no-suggestions">
            <em>Nothing was found</em>
          </div>
        );
      }
    }

    return (
      <div className="autocomplete">
        <input
          autoFocus={true}
          type="text"
          onChange={(e) => this.onChange(e)}
          onKeyDown={(e) => this.onKeyDown(e)}
          value={userInput}
          placeholder="Start typing..."
          data-testid="autocomplete-input"
        />
        {suggestionsListComponent}
      </div>
    );
  }
}

export default Autocomplete;
