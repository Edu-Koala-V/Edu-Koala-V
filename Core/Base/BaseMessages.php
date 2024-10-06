<?php

/**
 * BaseMessages - klasa zawierająca stałe wiadomości
 */

namespace Core\Base;

class BaseMessages
{

    //? INFO
    const INFO_PASSWORD_EXPIRED = "Hasło wygasło. Wymagana zmiana hasła";
    const INFO_CHANGE_PASSWORD_NEW_ACCOUNT = "Nowe konto, wymagana zmiana hasła";
    const INFO_ACCOUNT_BLOCKED = "Konto zablokowane";
    const INFO_ACCOUNT_SUSPENDED = "Konto zawieszone do 30 września. Po tym czasie konto zostanie usunięte.<br> Aby temu zapobiec, skontaktuj się z administratorem platformy.";


    //! ERROR

    const ERROR_MISSING_LOGIN_DATA = "Brak wymaganych danych do zalogowania";
    const ERROR_ACCOUNT_NOT_EXIST = "Konto o podanym loginie nie istnieje";
    const ERROR_BAD_PASSWORD = "Podano nieprawidłowe hasło";
    const ERROR_MISSING_PASSWORD_CHANGE_DATA = "Brak wymaganych danych do zmiany hasła";
    const ERROR_PASSWORD_CHANGE = "Błąd zmiany hasła";
    const ERROR_BAD_LOGIN = "Konto o podanym loginie nie istnieje";
    const ERROR_PASSWORD_INCORRECT = "Podano nieprawidłowe hasło";
    const ERROR_PASSWORD_SAME = "Nowe hasło nie może być takie samo jak stare";
    const ERROR_AVATAR_CHANGE = "Błąd zmiany avatara";
    const ERROR_MISSING_AVATAR_DATA = "Brak wymaganych danych do zmiany avatara";

    //* SUCCESS
    const SUCCESS_LOGIN = "Zalogowano pomyślnie.";
    const SUCCESS_AVATAR_CHANGE = "Zmieniono avatar";

}
