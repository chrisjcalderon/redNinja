The AppController is globally available AND defined under 
    a) appController
    b) myApp

    The module names for those objects can also be required as a DEP using 
    ['AppController'] for the AppControlle or
    ['AppModels'] for the ModelController  (note, they both use a XXX module pattern and return aliases for their internal functions
    

    NOTE models and view models are Javascript AMD compliant Modules
 
    MODULES: Are application components that are comprissed of
        1) An html file, with a reference to baseController, passing the module to be loaded in the my-[] parameters
        2) A script file specified in the my-module parameter
        The script file should be surrounded by an enclosure to avoid global scope leaking
        It can be an AMD module
        It can use myApp.models.register(modelName, new modelApp()); where modelName is the the ID of the
        model/module - it's used by the model controller to access it by name by other application components
        if needed.
    MODELS: A model is a Javascript AMD compliant module. The name of the module is the script file to be loaded
            models can be loade in different ways:
            1) using LoadModel - <model> - this method returns a promise, which when resolved will return the results
            2) as part of a define dep. It must use the following convention 'models/<modelname'
    VIEWMODELS: Same as with MODELS, but you can pass a KO template and a container to bind the model. This
                is useful for dynamic load and binding of models


  AppController
        _config         (curl, paths, etc)
        _scripts        script tags
        _loadQueue      scripts not processed by the controller
        _processed      scripts processed by the controller
        _modelController -> ModelController
        _loadModulesFromScriptTags  refresfes the loadQueue
        _loadCurl       loads CURL
        _init           initializes (or re-run) the controller. In the case of a re-run, it simply process additional scripts
        _run            runs curl per the configuration
        _runModules     processes the loadQueue

        log             a console logger 

    }

    ModelController
        controller -> AppController
        _models             array of modules loaded
        _containers         array of containers
        _listeners          array of listeners 
        _loadModel          loads an AMD model and returns it as a promisse
        _loadViewModel      loads an AMD model and binds it to a template on a container using KO
        _loadFile           loads a file and returns its content (txt, html... etc)
        _createMessage      creates and returns a message object
        _sendMessage        sends a message to listeners
        _registerListener   registers a listener for a specific message
        _run                process all the modules not yet proccesses
        _register           registers a module with the controller
        _get                gets a model 
        _getModel           gets a model - fail safe way for getting a model
        _load               executes the model.load if present
        _isDefined          returns true if model is in models
        _init               executes model.onInit if present
        _destroy            executes model.onDestroy and destroys the module
        _interface ->       This is the external interface, as per a module revealing pattern.
                            it exposes the internal methods with a public interface and aggregates
                            methods from both model controller and application controller


shoul I use 
    ko.observableArrays() for managing modules?

    Should I use the concept of a page life cycle?            
            PageInit
            PageLoad
            PageRendered
    Should I create a Page Abstract Class with methods basic and fuctions?
        Page->QueryString
        Page->[Modules Stuff]
        Page->NavigateTo
        Page->
             


/scripts
    /app
    /lib
/views
    /templates ?
    /models
    /viewmodels
/media
    /images
    /content
/styles

