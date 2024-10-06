<?php
namespace Core;

class Container {
    private $instances = [];

    public function set($object) {
        $this->instances[get_class($object)] = $object;
    }

    public function get($className) {
        if (!array_key_exists($className, $this->instances)) {
            $this->instances[$className] = new $className();
        }
        return $this->instances[$className];
    }
}