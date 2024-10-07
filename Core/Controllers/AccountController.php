<?php
/**
 * Kontroler obsługujący konta użytkowników. 
 * 
 * Zawiera następujące metody:
 * 
 * - login() - logowanie użytkownika
 * - validateLoginData($requestData) - metoda walidująca dane logowania
 * - handleAccountStatus($login) - metoda obsługująca różne statusy konta
 * - changePassword() - zmiana hasła użytkownika
 * - validatePasswordChangeData($requestData) - metoda walidująca dane zmiany hasła
 * - getPasswordChangeError($login, $oldPassword, $newPassword) - metoda sprawdzająca błędy przy zmianie hasła
 * - loginSuccess() - metoda obsługująca pomyślne logowanie użytkownika
 * - logout() - wylogowanie użytkownika
 * - createAccount($username, $role) - tworzenie nowego konta
 * - avatarChange() - zmiana avatara użytkownika
 */

namespace Core\Controllers;

use Core\Base\BaseController;
use Core\Models\AccountModel;
use Core\Auth\Auth;
use Core\Models\ClassesModel;
use Core\Base\BaseMessages;

class AccountController extends BaseController
{
    // Stałe dla wskaźników odpowiedzi
    const RESPONSE_ERROR = ["status" => "error"];
    const RESPONSE_INFO = ["status" => "info"];
    const RESPONSE_SUCCESS = ["status" => "success"];

    /**
     * Metoda obsługująca logowanie użytkownika.
     * 
     * Pobiera dane logowania z żądania, sprawdza poprawność loginu i hasła,
     * oraz status konta użytkownika. W zależności od wyniku walidacji, zwraca odpowiedni komunikat JSON.
     * 
     * @requires mixed $requestData["login"] Login użytkownika.
     * @requires mixed $requestData["password"] Hasło użytkownika.
     * 
     * @return void
     */
    public function login()
    {
        $requestData = self::getRequestData();
        if (!$this->validateLoginData($requestData)) {
            self::echo_asJSON(array_merge(self::RESPONSE_ERROR, ["message" => BaseMessages::ERROR_MISSING_LOGIN_DATA]));
            return;
        }

        $login = $requestData["login"];
        $password = $requestData["password"];

        if (!AccountModel::isExitAccountByLogin($login)) {
            self::echo_asJSON(array_merge(self::RESPONSE_ERROR, ["action" => "bad-login", "message" => BaseMessages::ERROR_ACCOUNT_NOT_EXIST]));
            return;
        }

        if (!AccountModel::checkPassword($login, $password)) {
            self::echo_asJSON(array_merge(self::RESPONSE_ERROR, ["action" => "bad-password", "message" => BaseMessages::ERROR_BAD_PASSWORD]));
            return;
        }

        if ($this->handleAccountStatus($login)) {
            return;
        }

        $dates = AccountModel::getUpdateDate($login);
        if ($dates['updated_at'] <= date("Y-m-d H:i:s", strtotime("-200 day"))) {
            self::echo_asJSON(array_merge(self::RESPONSE_INFO, ["action" => "change-password", "message" => BaseMessages::INFO_PASSWORD_EXPIRED]));
            return;
        }

        $this->loginSuccess($login);
    }

    /**
     * Metoda walidująca dane logowania.
     * 
     * Sprawdza, czy w żądaniu znajdują się wymagane pola: login i hasło.
     * 
     * @param array $requestData Dane z żądania.
     * @return bool
     */
    private function validateLoginData($requestData)
    {
        return isset($requestData["login"]) && isset($requestData["password"]);
    }

    /**
     * Metoda obsługująca różne statusy konta.
     * 
     * Sprawdza status konta użytkownika i zwraca odpowiedni komunikat.
     * 
     * @param string $login Login użytkownika.
     * @return bool
     */
    private function handleAccountStatus($login)
    {
        switch (AccountModel::checkStatus($login)) {
            case "new":
                self::echo_asJSON(array_merge(self::RESPONSE_INFO, ["action" => "change-password", "message" => BaseMessages::INFO_CHANGE_PASSWORD_NEW_ACCOUNT]));
                return true;
            case "blocked":
                self::echo_asJSON(array_merge(self::RESPONSE_INFO, ["message" => BaseMessages::INFO_ACCOUNT_BLOCKED]));
                return true;
            case "suspended":
                self::echo_asJSON(array_merge(self::RESPONSE_INFO, ["message" => BaseMessages::INFO_ACCOUNT_SUSPENDED]));
                return true;
            default:
                return false;
        }
    }

    /**
     * Metoda obsługująca zmianę hasła użytkownika.
     * 
     * Pobiera dane z żądania, sprawdza poprawność starego hasła oraz waliduje nowe hasło.
     * W przypadku błędów zwraca odpowiedni komunikat. W przeciwnym razie zmienia hasło użytkownika.
     * 
     * @requires mixed $requestData["login"] Login użytkownika.
     * @requires mixed $requestData["newPassword"] Nowe hasło użytkownika.
     * @requires mixed $requestData["oldPassword"] Stare hasło użytkownika.
     * 
     * @return void
     */
    public function changePassword()
    {
        $requestData = self::getRequestData();
        if (!$this->validatePasswordChangeData($requestData)) {
            self::echo_asJSON(array_merge(self::RESPONSE_ERROR, ["message" => BaseMessages::ERROR_MISSING_PASSWORD_CHANGE_DATA]));
            return;
        }

        $login = $requestData["login"];
        $oldPassword = $requestData["oldPassword"];
        $newPassword = $requestData["newPassword"];

        $error = $this->getPasswordChangeError($login, $oldPassword, $newPassword);
        if ($error !== "") {
            self::echo_asJSON(array_merge(self::RESPONSE_ERROR, ["message" => $error]));
            return;
        }

        if (!AccountModel::changePassword($login, $newPassword)) {
            self::echo_asJSON(array_merge(self::RESPONSE_ERROR, ["message" => BaseMessages::ERROR_PASSWORD_CHANGE]));
            return;
        }

        AccountModel::changeStatus($login, null);
        $this->loginSuccess($login);
    }

    /**
     * Metoda walidująca dane zmiany hasła.
     * 
     * Sprawdza, czy w żądaniu znajdują się wymagane pola: login, stare hasło i nowe hasło.
     * 
     * @param array $requestData Dane z żądania.
     * @return bool
     */
    private function validatePasswordChangeData($requestData)
    {
        return isset($requestData["login"]) && isset($requestData["newPassword"]) && isset($requestData["oldPassword"]);
    }

    /**
     * Metoda sprawdzająca błędy przy zmianie hasła.
     * 
     * Sprawdza, czy konto istnieje, czy stare hasło jest poprawne oraz czy nowe hasło różni się od starego.
     * 
     * @param string $login Login użytkownika.
     * @param string $oldPassword Stare hasło.
     * @param string $newPassword Nowe hasło.
     * @return string
     */
    private function getPasswordChangeError($login, $oldPassword, $newPassword)
    {
        if (!AccountModel::isExitAccountByLogin($login)) {
            return BaseMessages::ERROR_BAD_LOGIN;
        }
        if (!AccountModel::checkPassword($login, $oldPassword)) {
            return BaseMessages::ERROR_PASSWORD_INCORRECT;
        }
        if ($oldPassword === $newPassword) {
            return BaseMessages::ERROR_PASSWORD_SAME;
        }
        return "";
    }

    /**
     * Metoda obsługująca pomyślne logowanie użytkownika.
     * 
     * Regeneruje token CSRF, pobiera dane konta i ustawia odpowiednie sesje.
     * 
     * @param string $login Login użytkownika.
     * @return void
     */
    private function loginSuccess($login)
    {
        Auth::regenerateTokenCSRF();
        $accountData = AccountModel::getAccountData($login);

        $_SESSION["user"] = AccountModel::getUserData($accountData['role'] . 's', $accountData['id']);
        $_SESSION["user"]["settings"] = json_decode($accountData['settings'], true);

        switch ($accountData['role']) {
            case "admin":
                $_SESSION["user"]["privileges"] = "admin";
                break;
            case "teacher":
                $_SESSION["user"]["privileges"] = "teacher";
                break;
            case "student":
                $_SESSION["user"]["privileges"] = "student";
                $_SESSION["user"]["class_name"] = ClassesModel::getClassName($_SESSION["user"]["class_id"]);
                break;
        }

        self::echo_asJSON(array_merge(self::RESPONSE_SUCCESS, ["message" => BaseMessages::SUCCESS_LOGIN]));
    }

    /**
     * Metoda obsługująca wylogowanie użytkownika.
     * 
     * Czyści sesję i przekierowuje użytkownika na stronę główną.
     * 
     * @return void
     */
    public function logout()
    {
        $_SESSION[] = [];
        session_unset();
        session_destroy();
        header('Location: /');
    }

    /**
     * Metoda obsługująca tworzenie nowego konta.
     * 
     * Tworzy nowe konto z podanym loginem i rolą, a następnie zwraca odpowiedni komunikat.
     * 
     * @param string $username Nazwa użytkownika.
     * @param string $role Rola użytkownika.
     * @return array
     */
    public function createAccount($username, $role)
    {
        $password = "ZAQ!2wsx1234";
        $login = $username;
        $role = $role;
        $accountMessage = AccountModel::addAccount($login, $password, $role);
        if (is_array($accountMessage)) {
            if ($accountMessage['status'] == self::RESPONSE_SUCCESS['status']) {
                $message = array_merge(self::RESPONSE_SUCCESS, [
                    "message" => "Konto zostało utworzone. Login: {$login}, Hasło: {$password}",
                    "Login" => $login,
                    "AccountID" => AccountModel::getAccountData($login)['id']
                ]);
            } else {
                $message = $accountMessage;
            }
            self::echo_asJSON($message);
            return $message;
        }
    }

    /**
     * Metoda obsługująca zmianę avatara użytkownika.
     * 
     * Pobiera dane z żądania, sprawdza poprawność i zmienia avatar użytkownika.
     * 
     * @requires mixed - $requestData["avatar"] Avatar użytkownika.
     * @return void
     */
    public function avatarChange()
    {
        $requestData = self::getRequestData();
        if (isset($requestData["avatar"])) {
            $avatar = $requestData["avatar"];
            if (AccountModel::changeAvatar($_SESSION["user"]["id"], $avatar)) {
                self::echo_asJSON(array_merge(self::RESPONSE_SUCCESS, ["message" => BaseMessages::SUCCESS_AVATAR_CHANGE]));
            } else {
                self::echo_asJSON(array_merge(self::RESPONSE_ERROR, ["message" => BaseMessages::ERROR_AVATAR_CHANGE]));
            }
        } else {
            self::echo_asJSON(array_merge(self::RESPONSE_ERROR, ["message" => BaseMessages::ERROR_MISSING_AVATAR_DATA]));
        }
    }

    public function getAccountDataGithubToken(){
        self::echo_asJSON(["token" => $_SESSION["user"]["github_token"]]);
    }

    public function resetPassword(){
        $requestData = self::getRequestData();
        $login = $requestData["login"];
        $accountData = AccountModel::getAccountData($login);
        if($accountData){
            $newPassword = AccountModel::resetPassword($login);
            self::echo_asJSON(array_merge(self::RESPONSE_SUCCESS, ["message" => "Nowe hasło: ZAQ!2wsx1234"]));
        }else{
            self::echo_asJSON(array_merge(self::RESPONSE_ERROR, ["message" => "Konto nie istnieje"]));
        }
    }
}